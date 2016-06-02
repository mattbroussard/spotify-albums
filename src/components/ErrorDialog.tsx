
import * as React from "react";

interface Props {
  onRetry?: () => void;
};

class ErrorDialog extends React.Component<Props, {}> {
  render() {
    var onRetry = this.props.onRetry || null;

    return (
      <div className="error-dialog-outer">
        <div className="error-dialog">
          <h1>An unknown error occurred.</h1>
          <button onClick={onRetry}>Try Again</button>
        </div>
      </div>
    );
  }
}

export default ErrorDialog;
