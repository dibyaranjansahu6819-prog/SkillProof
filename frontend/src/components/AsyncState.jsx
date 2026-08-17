function AsyncState({
  loading = false,
  error = "",
  empty = false,
  emptyTitle = "Nothing here yet",
  emptyMessage = "",
  loadingMessage = "Loading...",
  onRetry = null,
  children,
}) {
  if (loading) {
    return (
      <div className="async-state async-loading">
        <div className="async-spinner" />

        <div>
          <strong>
            {loadingMessage}
          </strong>

          <span>
            Please wait...
          </span>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="async-state async-error">

        <div className="async-state-icon">
          ⚠️
        </div>

        <div className="async-state-content">

          <strong>
            Something went wrong
          </strong>

          <span>
            {error}
          </span>

          {onRetry && (
            <button
              type="button"
              className="async-retry-button"
              onClick={onRetry}
            >
              Try Again
            </button>
          )}

        </div>

      </div>
    );
  }


  if (empty) {
    return (
      <div className="async-state async-empty">

        <div className="async-state-icon">
          📭
        </div>

        <div className="async-state-content">

          <strong>
            {emptyTitle}
          </strong>

          {emptyMessage && (
            <span>
              {emptyMessage}
            </span>
          )}

        </div>

      </div>
    );
  }


  return children;
}


export default AsyncState;