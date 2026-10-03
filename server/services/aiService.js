/**
 * AI Matching and Assistance Service
 *
 * - calculateMatch()           — deterministic weighted scoring (no external API)
 * - analyzeProfile()           — deterministic profile completion analysis (no external API)
 * - generateApplicationMessage() — AI-powered cover letter via Hugging Face Inference API
 *                                  Falls back to template-based generation when HF_TOKEN
 *                                  is absent or the API is unavailable.
 *
 * Hugging Face model: mistralai/Mistral-7B-Instruct-v0.2
 *   - Instruction-tuned LLM, publicly accessible via HF Inference API
 *   - Chosen for strong instruction-following, professional writing quality,
 *     and free-tier availability on Hugging Face
 *
 * Environment variable required:
 *   HF_TOKEN=<your_hugging_face_token>   (set in server/.env)
 */

const { HfInference } = require('@huggingface/inference');

// ---------------------------------------------------------------------------
// Hugging Face client — initialised lazily so a missing token only breaks the
// cover-letter endpoint, not the rest of the application.
// ---------------------------------------------------------------------------
const HF_MODEL = 'mistralai/Mistral-7B-Instruct-v0.2';

function getHfClient() {
  const token = process.env.HF_TOKEN;
  if (!token) {
    return null; // Fallback to template generation
  }
  return new HfInference(token);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function normalize(str) {
  return (str || '').toLowerCase().trim();
}

// ---------------------------------------------------------------------------
// 1. calculateMatch — purely deterministic, no external API
// ---------------------------------------------------------------------------
/**
 * Calculates match percentage and detailed breakdown between a student profile and a job.
 */
function calculateMatch(student, job) {
  if (!student || !job) {
    return {
      score: 50,
      breakdown: { skill: 25, location: 10, availability: 10, jobType: 5, education: 0 },
      matchedSkills: [],
      missingSkills: job ? (job.skills || []) : [],
      reasons: ['Complete your profile to see accurate AI matching!']
    };
  }

  const studentSkills = (student.skills || []).map(s => normalize(s));
  const jobSkills = (job.skills || []).map(s => normalize(s));

  // 1. Skill Match (50%)
  const matchedSkills = [];
  const missingSkills = [];

  jobSkills.forEach(reqSkill => {
    const isMatched = studentSkills.some(userSkill =>
      userSkill === reqSkill ||
      userSkill.includes(reqSkill) ||
      reqSkill.includes(userSkill)
    );
    if (isMatched) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  const skillRatio = jobSkills.length > 0 ? (matchedSkills.length / jobSkills.length) : 0.8;
  const skillScore = Math.round(skillRatio * 50);

  // 2. Location & Work Mode Match (15%)
  let locationScore = 5;
  const jobMode = (job.workMode || '').toLowerCase();
  const jobLoc = normalize(job.location);
  const userLoc = normalize(student.location);
  const userTypes = (student.preferredJobTypes || []).map(t => normalize(t));

  if (jobMode === 'remote' || userTypes.includes('remote')) {
    locationScore = 15;
  } else if (userLoc && (jobLoc.includes(userLoc) || userLoc.includes(jobLoc))) {
    locationScore = 15;
  } else if (jobMode === 'hybrid') {
    locationScore = 10;
  }

  // 3. Availability Match (15%)
  let availabilityScore = 6;
  const userAvail = (student.availability || []).map(a => normalize(a));
  const jobSchedule = normalize(job.workingHours + ' ' + job.jobType);

  if (userAvail.includes('flexible')) {
    availabilityScore = 15;
  } else if (userAvail.some(av => jobSchedule.includes(av) || (av === 'weekends' && job.jobType === 'Weekend'))) {
    availabilityScore = 15;
  } else if (userAvail.length > 0) {
    availabilityScore = 11;
  }

  // 4. Job Type & Category Match (10%)
  let jobTypeScore = 3;
  const preferredCats = (student.preferredCategories || []).map(c => normalize(c));
  const jobCat = normalize(job.category);
  const jobType = normalize(job.jobType);

  if (preferredCats.includes(jobCat) || userTypes.includes(jobType)) {
    jobTypeScore = 10;
  } else if (preferredCats.length > 0 || userTypes.length > 0) {
    jobTypeScore = 7;
  }

  // 5. Education Match (10%)
  let educationScore = 3;
  const edu = student.education || {};
  if (edu.degree || edu.college) {
    educationScore = 8;
    const deg = normalize(edu.degree + ' ' + (edu.branch || ''));
    if (jobCat === 'technology' && (deg.includes('btech') || deg.includes('b.tech') || deg.includes('computer') || deg.includes('bca') || deg.includes('it') || deg.includes('mca') || deg.includes('science') || deg.includes('engineering'))) {
      educationScore = 10;
    } else if (jobCat === 'marketing' && (deg.includes('bba') || deg.includes('mba') || deg.includes('commerce') || deg.includes('management'))) {
      educationScore = 10;
    } else if (jobCat === 'education' || jobCat === 'content' || jobCat === 'research') {
      educationScore = 10;
    }
  }

  let totalScore = skillScore + locationScore + availabilityScore + jobTypeScore + educationScore;
  totalScore = Math.min(96, Math.max(38, totalScore));

  // Generate dynamic reasons
  const reasons = [];

  if (matchedSkills.length > 0) {
    const skillNames = matchedSkills.slice(0, 3).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
    reasons.push(`Strong skill match: Your ${skillNames} expertise matches the core requirements for this position.`);
  } else {
    reasons.push(`Opportunity to learn: This role builds foundation skills in ${jobSkills.slice(0, 2).join(' & ')}.`);
  }

  if (jobMode === 'remote') {
    reasons.push('Remote flexibility: This position is 100% remote, allowing you to easily balance college coursework.');
  } else if (locationScore === 15) {
    reasons.push(`Location alignment: Conveniently situated in ${job.location} matching your preferred vicinity.`);
  }

  if (availabilityScore >= 12) {
    reasons.push(`Schedule compatibility: The estimated ${job.workingHours || 'flexible schedule'} fits nicely with your stated availability.`);
  }

  if (preferredCats.includes(jobCat)) {
    reasons.push(`Career interest: Direct match with your chosen interest in ${job.category}.`);
  }

  return {
    score: totalScore,
    breakdown: {
      skill: skillScore,
      location: locationScore,
      availability: availabilityScore,
      jobType: jobTypeScore,
      education: educationScore
    },
    matchedSkills: matchedSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    missingSkills: missingSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    reasons
  };
}

// ---------------------------------------------------------------------------
// 2. generateApplicationMessage — Hugging Face powered, with template fallback
// ---------------------------------------------------------------------------

/**
 * Local template fallback — used when HF_TOKEN is absent or HF API is unavailable.
 */
function generateTemplateCoverLetter(student, job) {
  const name = student.name || 'Candidate';
  const college = student.education?.college ? `at ${student.education.college}` : '';
  const degree = student.education?.degree ? `studying ${student.education.degree}` : 'as an enthusiastic student';

  const studentSkills = student.skills || [];
  const matched = (job.skills || []).filter(js =>
    studentSkills.some(ss => normalize(ss) === normalize(js) || normalize(ss).includes(normalize(js)))
  );

  const keySkills = matched.length > 0
    ? matched.slice(0, 3).join(', ')
    : (studentSkills.slice(0, 3).join(', ') || 'communication and problem solving');

  const templates = [
    `Dear Hiring Team at ${job.company},

I am excited to apply for the ${job.title} position. As a student ${degree} ${college}, I have developed hands-on skills in ${keySkills} which align directly with your job requirements.

This ${job.jobType.toLowerCase()} role matches my ${student.availability?.join(' & ') || 'flexible'} schedule, and I am eager to contribute meaningfully to ${job.company}'s projects while expanding my professional experience.

Thank you for considering my application. I look forward to the opportunity to discuss how I can add value to your team.

Warm regards,
${name}`,

    `Hello Hiring Manager at ${job.company},

I am writing to express my strong interest in the ${job.title} opportunity. My academic journey ${college ? `at ${college}` : ''} and practical experience with ${keySkills} make me well-suited for the responsibilities outlined in your description.

I am particularly drawn to this role because of ${job.company}'s work in ${job.category} and the flexibility to work ${job.workMode.toLowerCase()}. I am self-motivated, quick to learn, and ready to dedicate high-quality effort to this position.

I would welcome the chance to interview and discuss my background further.

Sincerely,
${name}`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Builds the instruction prompt sent to the Hugging Face model.
 * Keeps it concise — Mistral-7B-Instruct performs best with clear, brief prompts.
 */
function buildCoverLetterPrompt(student, job) {
  const name = student.name || 'Candidate';
  const degree = student.education?.degree || 'undergraduate degree';
  const college = student.education?.college || 'university';
  const skills = (student.skills || []).slice(0, 6).join(', ') || 'various technical skills';
  const availability = (student.availability || []).join(', ') || 'flexible hours';

  const jobSkills = (job.skills || []).slice(0, 5).join(', ') || 'relevant skills';

  return `<s>[INST] Write a concise, professional job application cover letter for a part-time or internship position.

Applicant details:
- Name: ${name}
- Degree: ${degree} at ${college}
- Skills: ${skills}
- Availability: ${availability}

Job details:
- Title: ${job.title}
- Company: ${job.company}
- Type: ${job.jobType}
- Work mode: ${job.workMode}
- Category: ${job.category}
- Required skills: ${jobSkills}

Instructions:
- Keep the letter between 150 and 220 words
- Use a professional yet enthusiastic tone appropriate for a student applicant
- Address it to "Hiring Team at ${job.company}"
- Sign off with the applicant's name
- Do NOT include any explanation or commentary outside the letter itself
- Output only the cover letter text [/INST]`;
}

/**
 * Strips any residual model tokens or preamble from raw HF output.
 */
function cleanHfOutput(raw) {
  if (!raw) return '';
  // Remove any [INST]...[/INST] remnants that sometimes leak through
  let cleaned = raw.replace(/<s>|<\/s>|\[INST\]|\[\/INST\]/g, '').trim();
  // If model repeated the prompt instructions, take only the text after the last [/INST]
  const instEnd = cleaned.lastIndexOf('[/INST]');
  if (instEnd !== -1) {
    cleaned = cleaned.slice(instEnd + 7).trim();
  }
  return cleaned;
}

/**
 * Generates a personalised cover letter.
 * Uses Hugging Face Mistral-7B when HF_TOKEN is set; falls back to local template otherwise.
 */
async function generateApplicationMessage(student, job) {
  const hf = getHfClient();

  if (!hf) {
    // No token configured — use template fallback silently
    console.log('[AI Service] HF_TOKEN not set. Using template-based cover letter generation.');
    return generateTemplateCoverLetter(student, job);
  }

  try {
    const prompt = buildCoverLetterPrompt(student, job);

    const response = await hf.textGeneration({
      model: HF_MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 350,
        temperature: 0.7,
        top_p: 0.9,
        repetition_penalty: 1.1,
        return_full_text: false  // Return only generated tokens, not the prompt
      }
    });

    const generatedText = cleanHfOutput(response?.generated_text || '');

    if (!generatedText || generatedText.length < 80) {
      // Output too short — model likely returned nothing useful
      console.warn('[AI Service] HF returned insufficient output. Falling back to template.');
      return generateTemplateCoverLetter(student, job);
    }

    return generatedText;

  } catch (err) {
    // Map HF error types to safe, non-leaking log messages
    if (err.message?.includes('401') || err.message?.toLowerCase().includes('unauthorized')) {
      console.error('[AI Service] Hugging Face authentication failed. Check that HF_TOKEN is valid.');
    } else if (err.message?.includes('403') || err.message?.toLowerCase().includes('forbidden')) {
      console.error('[AI Service] Hugging Face access denied. Ensure your token has inference permissions.');
    } else if (err.message?.includes('503') || err.message?.toLowerCase().includes('loading')) {
      console.warn('[AI Service] Hugging Face model is loading. Falling back to template.');
    } else if (err.message?.includes('429') || err.message?.toLowerCase().includes('rate limit')) {
      console.warn('[AI Service] Hugging Face rate limit reached. Falling back to template.');
    } else if (err.name === 'TypeError' || err.message?.toLowerCase().includes('fetch')) {
      console.error('[AI Service] Network error reaching Hugging Face API. Falling back to template.');
    } else {
      console.error('[AI Service] Hugging Face API error:', err.message);
    }

    // Always fall back gracefully — never expose error details to the client
    return generateTemplateCoverLetter(student, job);
  }
}

// ---------------------------------------------------------------------------
// 3. analyzeProfile — purely deterministic, no external API
// ---------------------------------------------------------------------------
/**
 * Analyzes student profile completion and returns missing items + improvement tips.
 */
function analyzeProfile(student) {
  let score = 20; // Base score for registration
  const missing = [];
  const tips = [];

  if (student.name && student.email) score += 10;

  if (student.phone) {
    score += 5;
  } else {
    missing.push('Phone number');
  }

  if (student.location) {
    score += 10;
  } else {
    missing.push('Location');
    tips.push('Add your preferred location to improve local & hybrid AI job matching.');
  }

  if (student.education && (student.education.degree || student.education.college)) {
    score += 15;
  } else {
    missing.push('Education details (Degree, College)');
    tips.push('Specify your degree and college so employers can evaluate academic standing.');
  }

  if (student.skills && student.skills.length > 0) {
    const skillCountBonus = Math.min(20, student.skills.length * 5);
    score += skillCountBonus;
    if (student.skills.length < 3) {
      tips.push('Add at least 3 skills to dramatically increase your AI match score.');
    }
  } else {
    missing.push('Skills');
    tips.push('Add your technical and soft skills to unlock personalized AI job matches.');
  }

  if (student.availability && student.availability.length > 0) {
    score += 10;
  } else {
    missing.push('Availability (Weekdays, Weekends, Flexible)');
    tips.push('Set your availability hours so we match jobs that don\'t conflict with classes.');
  }

  if (student.preferredJobTypes && student.preferredJobTypes.length > 0) {
    score += 10;
  } else {
    missing.push('Preferred Job Types');
  }

  score = Math.min(100, score);

  return {
    completionPercentage: score,
    missingFields: missing,
    improvementTips: tips
  };
}

module.exports = {
  calculateMatch,
  generateApplicationMessage,
  analyzeProfile
};
