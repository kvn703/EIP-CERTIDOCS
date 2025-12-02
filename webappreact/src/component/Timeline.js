import React from 'react';
import { FaCheckCircle, FaCircle, FaSpinner } from 'react-icons/fa';
import './Timeline.css';

const Timeline = ({ currentStep = 1, steps: customSteps }) => {
  const defaultSteps = [
    { id: 1, label: 'Génération', icon: FaCircle },
    { id: 2, label: 'Contenu', icon: FaCircle },
    { id: 3, label: 'Empreinte', icon: FaCircle },
  ];
  const steps = customSteps || defaultSteps;

  return (
    <div className="timeline-container">
      <div className="timeline-line">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isPending = currentStep < step.id;
          const nextStepCompleted = index < steps.length - 1 && currentStep > step.id + 1;

          return (
            <div key={step.id} className="timeline-step">
              <div className={`timeline-step-content ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isPending ? 'pending' : ''}`}>
                <div className="timeline-icon-wrapper">
                  {isCompleted ? (
                    <FaCheckCircle className="timeline-icon completed-icon" />
                  ) : isActive ? (
                    <FaSpinner className="timeline-icon active-icon" />
                  ) : (
                    <StepIcon className="timeline-icon pending-icon" />
                  )}
                  {isActive && <div className="timeline-pulse"></div>}
                </div>
                <span className="timeline-label">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`timeline-connector ${isCompleted || nextStepCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;



