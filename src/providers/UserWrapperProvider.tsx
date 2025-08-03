"use client";

import React, { useEffect } from "react";
import { useUser, UserProvider } from "../context/userContext";

export default function UserProviderWrapper({
  userId,
  children,
}: {
  userId: string | null;
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <UserSetter userId={userId}>{children}</UserSetter>
    </UserProvider>
  );
}

function UserSetter({
  userId,
  children,
}: {
  userId: string | null;
  children: React.ReactNode;
}) {
  const { setUserId } = useUser();

  useEffect(() => {
    setUserId(userId);
  }, [userId, setUserId]);

  return <>{children}</>;
}
