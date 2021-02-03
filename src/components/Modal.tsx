import React from "react";

interface Props {
  result: any;
  on: boolean;
  toggleOff: () => void;
}

const Modal = function ({ result, on, toggleOff }: Props) {
  return on ? (
    <div>
      <div className="modal">
        <div className="result"></div>
        <pre>
          <code>{JSON.stringify(result, null, 4)}</code>
        </pre>
      </div>
      <div className="layer" onClick={toggleOff}></div>
    </div>
  ) : null;
};

export default Modal;
