
import * as React from "react";

class LoadingIndicator extends React.Component<{},{}> {
  render() {
    return (
      <div className="loading-indicator">
        <i className="fa fa-cog fa-spin" />
      </div>
    );
  }
}

export default LoadingIndicator;
