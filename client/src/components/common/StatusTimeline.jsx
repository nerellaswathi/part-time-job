import React from 'react';
import { Check, Clock, X, AlertCircle } from 'lucide-react';

const STANDARD_STEPS = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'];

export default function StatusTimeline({ status = 'Applied', timeline = [] }) {
  const isRejected = status === 'Rejected';

  const steps = isRejected
    ? ['Applied', 'Under Review', 'Rejected']
    : STANDARD_STEPS;

  const getStepIndex = (st) => steps.indexOf(st);
  const currentIndex = getStepIndex(status);

  // Map notes/dates from timeline events
  const getTimelineInfo = (stepName) => {
    return (timeline || []).slice().reverse().find(t => t.status === stepName);
  };

  return (
    <div className="w-full py-4">
      <div className="relative">

        {/* Horizontal Connector Line for desktop */}
        <div className="hidden sm:block absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0">
          <div
            className={`h-full transition-all duration-500 ${isRejected ? 'bg-rose-500' : 'bg-indigo-600'
              }`}
            style={{
              width: currentIndex >= 0 ? `${(currentIndex / (steps.length - 1)) * 100}%` : '0%'
            }}
          />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
          {steps.map((stepName, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isStepRejected = isRejected && stepName === 'Rejected';
            const eventInfo = getTimelineInfo(stepName);

            let circleClass = 'bg-white border-2 border-slate-300 text-slate-400';
            if (isStepRejected) {
              circleClass = 'bg-rose-600 border-2 border-rose-600 text-white shadow-md shadow-rose-200';
            } else if (isCurrent) {
              circleClass = 'bg-indigo-600 border-2 border-indigo-600 text-white ring-4 ring-indigo-100 shadow-md shadow-indigo-200 animate-pulse';
            } else if (isCompleted) {
              circleClass = 'bg-indigo-600 border-2 border-indigo-600 text-white';
            }

            return (
              <div key={stepName} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">

                {/* Node icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-all ${circleClass}`}>
                  {isStepRejected ? (
                    <X className="w-4 h-4 stroke-[3]" />
                  ) : isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4 animate-spin-slow" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Step label and info */}
                <div className="flex-1 sm:flex-initial">
                  <p
                    className={`text-xs font-semibold ${isStepRejected
                        ? 'text-rose-600'
                        : isCurrent
                          ? 'text-indigo-600 font-bold'
                          : isCompleted
                            ? 'text-slate-800'
                            : 'text-slate-400'
                      }`}
                  >
                    {stepName}
                  </p>

                  {eventInfo?.date && (
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(eventInfo.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </p>
                  )}

                  {isCurrent && (
                    <span className="inline-block mt-1 text-[10px] bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded-full border border-indigo-200">
                      Current Stage
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
