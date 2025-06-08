"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { ScheduledArticle } from "@/lib/db";

interface ContentCalendarProps {
  scheduledArticles: ScheduledArticle[];
  articles: any[];
  onScheduleUpdate: () => void;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  scheduledArticles: ScheduledArticle[];
}

interface ScheduleDialogProps {
  article?: any;
  scheduledItem?: ScheduledArticle;
  onClose: () => void;
  onSubmit: (articleId: number, scheduledFor: string) => void;
  articles: any[];
}

function ScheduleDialog({
  article,
  scheduledItem,
  onClose,
  onSubmit,
  articles,
}: ScheduleDialogProps) {
  const [selectedArticle, setSelectedArticle] = useState(
    article?.id?.toString() || scheduledItem?.article_id?.toString() || ""
  );
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  useEffect(() => {
    if (scheduledItem) {
      const date = new Date(scheduledItem.scheduled_for);
      setScheduledDate(date.toISOString().split("T")[0]);
      setScheduledTime(date.toTimeString().slice(0, 5));
    }
  }, [scheduledItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedArticle && scheduledDate && scheduledTime) {
      const scheduledFor = new Date(
        `${scheduledDate}T${scheduledTime}`
      ).toISOString();
      onSubmit(parseInt(selectedArticle), scheduledFor);
      onClose();
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {scheduledItem ? "Edit Scheduled Article" : "Schedule Article"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="article">Article</Label>
          <Select
            value={selectedArticle}
            onValueChange={setSelectedArticle}
            disabled={!!article || !!scheduledItem}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an article" />
            </SelectTrigger>
            <SelectContent>
              {articles.map((art) => (
                <SelectItem key={art.id} value={art.id.toString()}>
                  {art.title_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="date">Scheduled Date</Label>
          <Input
            id="date"
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            required
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div>
          <Label htmlFor="time">Scheduled Time</Label>
          <Input
            id="time"
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            required
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            {scheduledItem ? "Update Schedule" : "Schedule Article"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}

function CalendarGrid({
  currentDate,
  scheduledArticles,
  onDayClick,
}: {
  currentDate: Date;
  scheduledArticles: ScheduledArticle[];
  onDayClick: (date: Date) => void;
}) {
  const today = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const days: CalendarDay[] = [];
  const current = new Date(startDate);

  for (let i = 0; i < 42; i++) {
    const dayScheduled = scheduledArticles.filter((item) => {
      const itemDate = new Date(item.scheduled_for);
      return (
        itemDate.getDate() === current.getDate() &&
        itemDate.getMonth() === current.getMonth() &&
        itemDate.getFullYear() === current.getFullYear()
      );
    });

    days.push({
      date: new Date(current),
      isCurrentMonth: current.getMonth() === currentDate.getMonth(),
      scheduledArticles: dayScheduled,
    });

    current.setDate(current.getDate() + 1);
  }

  return (
    <div className="grid grid-cols-7 gap-1">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div
          key={day}
          className="p-2 text-center text-sm font-medium text-gray-500 border-b"
        >
          {day}
        </div>
      ))}
      {days.map((day, index) => (
        <div
          key={index}
          className={`
            min-h-24 p-1 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors
            ${!day.isCurrentMonth ? "bg-gray-50 text-gray-400" : ""}
            ${
              day.date.toDateString() === today.toDateString()
                ? "bg-blue-50 border-blue-200"
                : ""
            }
          `}
          onClick={() => onDayClick(day.date)}
        >
          <div className="text-sm font-medium mb-1">{day.date.getDate()}</div>
          <div className="space-y-1">
            {day.scheduledArticles.slice(0, 2).map((item, idx) => (
              <div
                key={idx}
                className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate"
                title={item.title_en}
              >
                {item.title_en}
              </div>
            ))}
            {day.scheduledArticles.length > 2 && (
              <div className="text-xs text-gray-500">
                +{day.scheduledArticles.length - 2} more
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ScheduledArticlesList({
  scheduledArticles,
  onEdit,
  onPublish,
  onCancel,
}: {
  scheduledArticles: ScheduledArticle[];
  onEdit: (item: ScheduledArticle) => void;
  onPublish: (id: number) => void;
  onCancel: (id: number) => void;
}) {
  const getStatusColor = (scheduledFor: string) => {
    const scheduled = new Date(scheduledFor);
    const now = new Date();
    const diffHours = (scheduled.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 0) return "bg-red-100 text-red-800";
    if (diffHours < 24) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getStatusText = (scheduledFor: string) => {
    const scheduled = new Date(scheduledFor);
    const now = new Date();
    const diffHours = (scheduled.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 0) return "Overdue";
    if (diffHours < 1) return "Due soon";
    if (diffHours < 24) return "Due today";
    return "Scheduled";
  };

  return (
    <div className="space-y-3">
      {scheduledArticles.map((item) => (
        <Card key={item.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-grow">
              <h4 className="font-medium text-gray-900 mb-1">
                {item.title_en}
              </h4>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{new Date(item.scheduled_for).toLocaleString()}</span>
                <Badge className={getStatusColor(item.scheduled_for)}>
                  {getStatusText(item.scheduled_for)}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPublish(item.id)}
                className="text-green-600 hover:text-green-700"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCancel(item.id)}
                className="text-red-600 hover:text-red-700"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function ContentCalendar({
  scheduledArticles,
  articles,
  onScheduleUpdate,
}: ContentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduledArticle | null>(null);
  const [view, setView] = useState<"calendar" | "list">("calendar");

  const unpublishedArticles = articles.filter(
    (article) => !article.is_published
  );

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  const handleScheduleSubmit = async (
    articleId: number,
    scheduledFor: string
  ) => {
    try {
      const endpoint = editingItem
        ? `/api/admin/schedule/${editingItem.id}`
        : "/api/admin/schedule";

      const response = await fetch(endpoint, {
        method: editingItem ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, scheduledFor }),
      });

      if (response.ok) {
        onScheduleUpdate();
        setEditingItem(null);
      }
    } catch (error) {
      console.error("Failed to schedule article:", error);
    }
  };

  const handlePublish = async (scheduledId: number) => {
    try {
      const response = await fetch(
        `/api/admin/schedule/${scheduledId}/publish`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        onScheduleUpdate();
      }
    } catch (error) {
      console.error("Failed to publish article:", error);
    }
  };

  const handleCancel = async (scheduledId: number) => {
    try {
      const response = await fetch(
        `/api/admin/schedule/${scheduledId}/cancel`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        onScheduleUpdate();
      }
    } catch (error) {
      console.error("Failed to cancel scheduled article:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Calendar</h2>
          <p className="text-gray-600">
            Schedule and manage article publications
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              size="sm"
              variant={view === "calendar" ? "default" : "ghost"}
              onClick={() => setView("calendar")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </Button>
            <Button
              size="sm"
              variant={view === "list" ? "default" : "ghost"}
              onClick={() => setView("list")}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
          <Dialog
            open={showScheduleDialog}
            onOpenChange={setShowScheduleDialog}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Article
              </Button>
            </DialogTrigger>
            <ScheduleDialog
              scheduledItem={editingItem || undefined}
              onClose={() => {
                setShowScheduleDialog(false);
                setEditingItem(null);
              }}
              onSubmit={handleScheduleSubmit}
              articles={unpublishedArticles}
            />
          </Dialog>
        </div>
      </div>

      {view === "calendar" ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigateMonth("prev")}
                >
                  ←
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigateMonth("next")}
                >
                  →
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CalendarGrid
              currentDate={currentDate}
              scheduledArticles={scheduledArticles}
              onDayClick={(date) => setSelectedDate(date)}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <ScheduledArticlesList
              scheduledArticles={scheduledArticles}
              onEdit={(item) => {
                setEditingItem(item);
                setShowScheduleDialog(true);
              }}
              onPublish={handlePublish}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
