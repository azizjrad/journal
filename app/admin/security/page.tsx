"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SecurityDashboard } from "@/components/security-dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";

export default function SecurityAdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [auditResults, setAuditResults] = useState(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    checkAuthentication();
    fetchCSRFToken();
  }, []);

  const checkAuthentication = async () => {
    try {
      const response = await fetch("/api/admin/analytics");
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      router.push("/admin/login");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCSRFToken = async () => {
    try {
      const response = await fetch("/api/csrf");
      if (response.ok) {
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      }
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
    }
  };

  const runSecurityAudit = async (auditType = "full") => {
    if (!csrfToken) {
      await fetchCSRFToken();
      return;
    }

    setAuditLoading(true);
    try {
      const response = await fetch("/api/admin/security/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ auditType }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuditResults(data.audit);
      } else {
        console.error("Security audit failed");
      }
    } catch (error) {
      console.error("Error running security audit:", error);
    } finally {
      setAuditLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading security dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pass":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Pass
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Warning
          </Badge>
        );
      case "fail":
        return <Badge variant="destructive">Fail</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Security Administration
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage website security
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => runSecurityAudit("quick")}
            disabled={auditLoading}
            variant="outline"
          >
            {auditLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              "Quick Audit"
            )}
          </Button>
          <Button
            onClick={() => runSecurityAudit("full")}
            disabled={auditLoading}
          >
            {auditLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              "Full Security Audit"
            )}
          </Button>
        </div>
      </div>

      {auditResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Security Audit Results
            </CardTitle>
            <CardDescription>
              Audit completed on{" "}
              {new Date(auditResults.timestamp).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div
                  className={`text-3xl font-bold ${getScoreColor(
                    auditResults.score
                  )}`}
                >
                  {auditResults.score}/100
                </div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {auditResults.summary.passed}
                </div>
                <div className="text-sm text-gray-600">Checks Passed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {auditResults.summary.warnings}
                </div>
                <div className="text-sm text-gray-600">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {auditResults.summary.failures}
                </div>
                <div className="text-sm text-gray-600">Failures</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Security Checks</h3>
              <div className="grid gap-3">
                {Object.entries(auditResults.checks).map(([key, check]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </div>
                      <div className="text-sm text-gray-600">
                        {check.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${getScoreColor(
                          check.score
                        )}`}
                      >
                        {check.score}/100
                      </span>
                      {getStatusBadge(check.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {auditResults.recommendations.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {auditResults.recommendations.map((rec, index) => (
                    <Alert key={index}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <span className="font-medium">{rec.category}:</span>{" "}
                        {rec.description}
                        <div className="text-sm text-gray-600 mt-1">
                          {rec.impact}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <SecurityDashboard />
    </div>
  );
}
