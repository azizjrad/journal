"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Shield, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const router = useRouter();

  // Fetch CSRF token on component mount
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await fetch("/api/csrf");
        if (response.ok) {
          const data = await response.json();
          setCsrfToken(data.csrfToken);
        } else {
          console.error("Failed to fetch CSRF token");
        }
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };

    fetchCSRFToken();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Include CSRF token in the request
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          csrfToken,
        }),
      });

      if (response.ok) {
        router.push("/admin");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Invalid credentials");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-600 text-lg">
            Secure access to your news management system
          </p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-300">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center ring-8 ring-blue-50">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Enter your credentials to continue
            </p>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Admin Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 pl-4 pr-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/70 backdrop-blur-sm transition-all duration-200"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert
                  variant="destructive"
                  className="border-red-200 bg-red-50/80 backdrop-blur-sm"
                >
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 group"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Access Dashboard
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </Button>
            </form>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">
                  🔒 Secure admin access
                </p>
                <p className="text-xs text-gray-400">
                  Protected by enterprise-grade security
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">© 2024 Akhbarna News Platform</p>
        </div>
      </div>
    </div>
  );
}
