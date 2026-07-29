"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "@/lib/actions/auth.action";

type AuthUser = {
  id: string;
  name: string;
  email: string;
};

const AuthNav = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((currentUser) => setUser(currentUser))
      .finally(() => setIsLoading(false));
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    window.location.href = "/";
  };

  if (isLoading) {
    return null;
  }

  if (user) {
    return (
      <div className="auth-actions">
        <span>{user.name}</span>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="auth-actions">
      <Link href="/login">Login</Link>
      <Link href="/signup" className="primary">
        Sign up
      </Link>
    </div>
  );
};

export default AuthNav;
