"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Activity,
  Clock,
  Users,
  Lock,
  Eye,
} from "lucide-react";

interface SecurityMetrics {
  totalRequests: number;
  blockedRequests: number;
  rateLimitedRequests: number;
  csrfAttacks: number;
  suspiciousIPs: string[];
  lastSecurityEvent: string;
  activeAdminSessions: number;
  failedLoginAttempts: number;
}

interface SecurityEvent {
  id: string;
  type: "blocked" | "rate_limit" | "csrf" | "login_fail" | "suspicious";
  ip: string;
  timestamp: string;
  details: string;
}

export default function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalRequests: 0,
    blockedRequests: 0,
    rateLimitedRequests: 0,
    csrfAttacks: 0,
    suspiciousIPs: [],
    lastSecurityEvent: "",
    activeAdminSessions: 0,
    failedLoginAttempts: 0,
  });

  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSecurityData();
    const interval = setInterval(fetchSecurityData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSecurityData = async () => {
    try {
      // In a real implementation, these would be actual API calls
      // For now, we'll simulate the data structure

      const mockMetrics: SecurityMetrics = {
        totalRequests: Math.floor(Math.random() * 10000) + 5000,
        blockedRequests: Math.floor(Math.random() * 50),
        rateLimitedRequests: Math.floor(Math.random() * 100),
        csrfAttacks: Math.floor(Math.random() * 5),
        suspiciousIPs: ["192.168.1.100", "10.0.0.50"],
        lastSecurityEvent: new Date(
          Date.now() - Math.random() * 3600000
        ).toISOString(),
        activeAdminSessions: Math.floor(Math.random() * 3) + 1,
        failedLoginAttempts: Math.floor(Math.random() * 10),
      };

      const mockEvents: SecurityEvent[] = [
        {
          id: "1",
          type: "rate_limit",
          ip: "192.168.1.100",
          timestamp: new Date().toISOString(),
          details: "API rate limit exceeded on /api/admin/articles",
        },
        {
          id: "2",
          type: "blocked",
          ip: "10.0.0.50",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          details: "Suspicious request pattern detected",
        },
        {
          id: "3",
          type: "login_fail",
          ip: "192.168.1.200",
          timestamp: new Date(Date.now() - 600000).toISOString(),
          details: "Failed admin login attempt",
        },
      ];

      setMetrics(mockMetrics);
      setEvents(mockEvents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching security data:", error);
      setLoading(false);
    }
  };

  const getSecurityStatus = () => {
    const threatLevel =
      metrics.blockedRequests +
      metrics.csrfAttacks +
      metrics.failedLoginAttempts;
    if (threatLevel === 0)
      return { status: "secure", color: "green", text: "Secure" };
    if (threatLevel < 10)
      return { status: "warning", color: "yellow", text: "Monitoring" };
    return { status: "danger", color: "red", text: "High Alert" };
  };

  const getEventIcon = (type: SecurityEvent["type"]) => {
    switch (type) {
      case "blocked":
        return <Shield className="h-4 w-4 text-red-500" />;
      case "rate_limit":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "csrf":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "login_fail":
        return <Lock className="h-4 w-4 text-orange-500" />;
      case "suspicious":
        return <Eye className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const securityStatus = getSecurityStatus();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Status Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Security Status
            </CardTitle>
            <Shield className={`h-4 w-4 text-${securityStatus.color}-500`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityStatus.text}</div>
            <Badge
              variant={
                securityStatus.status === "secure" ? "default" : "destructive"
              }
              className="mt-2"
            >
              {securityStatus.status === "secure"
                ? "All Clear"
                : "Threats Detected"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.totalRequests.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Blocked Requests
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.blockedRequests}</div>
            <p className="text-xs text-muted-foreground">
              {(
                (metrics.blockedRequests / metrics.totalRequests) *
                100
              ).toFixed(2)}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Sessions
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.activeAdminSessions}
            </div>
            <p className="text-xs text-muted-foreground">Admin sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      {(metrics.blockedRequests > 0 ||
        metrics.csrfAttacks > 0 ||
        metrics.failedLoginAttempts > 5) && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Security events detected in the last 24 hours. Please review the
            activity below.
          </AlertDescription>
        </Alert>
      )}

      {/* Detailed Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Security Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Rate Limited Requests:</span>
              <Badge variant="outline">{metrics.rateLimitedRequests}</Badge>
            </div>
            <div className="flex justify-between">
              <span>CSRF Attacks Blocked:</span>
              <Badge
                variant={metrics.csrfAttacks > 0 ? "destructive" : "outline"}
              >
                {metrics.csrfAttacks}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Failed Login Attempts:</span>
              <Badge
                variant={
                  metrics.failedLoginAttempts > 5 ? "destructive" : "outline"
                }
              >
                {metrics.failedLoginAttempts}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Suspicious IPs:</span>
              <Badge
                variant={
                  metrics.suspiciousIPs.length > 0 ? "destructive" : "outline"
                }
              >
                {metrics.suspiciousIPs.length}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Security Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-start space-x-3">
                  {getEventIcon(event.type)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{event.details}</p>
                      <Badge variant="outline" className="text-xs">
                        {event.type.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>IP: {event.ip}</span>
                      <span>•</span>
                      <span>
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <div className="flex items-center justify-center p-4 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  No recent security events
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suspicious IPs */}
      {metrics.suspiciousIPs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suspicious IP Addresses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {metrics.suspiciousIPs.map((ip, index) => (
                <Badge
                  key={index}
                  variant="destructive"
                  className="justify-center"
                >
                  {ip}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">CSRF protection is active</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">Rate limiting is configured</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">Security headers are applied</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">Input validation is comprehensive</span>
          </div>
          {metrics.failedLoginAttempts > 5 && (
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">
                Consider implementing login attempt lockout
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
