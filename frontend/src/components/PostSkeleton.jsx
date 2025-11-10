import React from "react";
import "../styles/PostSkeleton.css";

export default function PostSkeleton() {
  return (
    <div className="post-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-avatar" />
        <div className="skeleton-lines">
          <div className="skeleton-line short" />
          <div className="skeleton-line long" />
        </div>
      </div>
      <div className="skeleton-body" />
      <div className="skeleton-footer">
        <div className="skeleton-line short" />
      </div>
    </div>
  );
}
