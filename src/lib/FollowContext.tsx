"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface FollowContextType {
  following: Set<string>;
  follow: (username: string) => void;
  unfollow: (username: string) => void;
  isFollowing: (username: string) => boolean;
  toggleFollow: (username: string) => void;
}

const FollowContext = createContext<FollowContextType>({
  following: new Set(),
  follow: () => {},
  unfollow: () => {},
  isFollowing: () => false,
  toggleFollow: () => {},
});

export function FollowProvider({ children }: { children: ReactNode }) {
  const [following, setFollowing] = useState<Set<string>>(new Set());

  const follow = useCallback((username: string) => {
    setFollowing((prev) => new Set([...prev, username]));
  }, []);

  const unfollow = useCallback((username: string) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      next.delete(username);
      return next;
    });
  }, []);

  const isFollowing = useCallback(
    (username: string) => following.has(username),
    [following]
  );

  const toggleFollow = useCallback(
    (username: string) => {
      if (following.has(username)) unfollow(username);
      else follow(username);
    },
    [following, follow, unfollow]
  );

  return (
    <FollowContext.Provider value={{ following, follow, unfollow, isFollowing, toggleFollow }}>
      {children}
    </FollowContext.Provider>
  );
}

export function useFollow() {
  return useContext(FollowContext);
}
