import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import { type DateClickArg } from "@fullcalendar/interaction";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { LoadingState } from "../components/ui/LoadingState";
import { PageHeader } from "../components/ui/PageHeader";
import { StatusBadge } from "../components/ui/StatusBadge";
import { cn, titleCase } from "../lib/utils";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { usePlannerData } from "../hooks/usePlannerData";
import { useToast } from "../hooks/useToast";
import { updateContentDate } from "../services/contentService";

type CalendarView = "dayGridMonth" | "timeGridWeek" | "listWeek";

export function CalendarPage() {
  const { content, loading } = usePlannerData();
  const navigate = useNavigate();
  const notify = useToast();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const calendarRef = useRef<FullCalendar | null>(null);
  const [title, setTitle] = useState("");
  const [activeView, setActiveView] = useState<CalendarView>(isMobile ? "listWeek" : "dayGridMonth");

  useEffect(() => {
    const nextView = isMobile ? "listWeek" : "dayGridMonth";
    setActiveView(nextView);
    calendarRef.current?.getApi().changeView(nextView);
  }, [isMobile]);

  if (loading) return <LoadingState label="Loading calendar" />;

  async function handleDrop(arg: { event: { id: string; start: Date | null }; revert: () => void }) {
    try {
      await updateContentDate(arg.event.id, arg.event.start ?? new Date());
      notify("Content rescheduled.", "success");
    } catch (error) {
      console.error(error);
      arg.revert();
      notify("Unable to reschedule content.", "error");
    }
  }

  function handleDateClick(arg: DateClickArg) {
    navigate(`/content/new?date=${arg.dateStr.slice(0, 10)}`);
  }

  function moveCalendar(direction: "prev" | "next" | "today") {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    api[direction]();
    setTitle(api.view.title);
  }

  function changeView(view: CalendarView) {
    const api = calendarRef.current?.getApi();
    setActiveView(view);
    api?.changeView(view);
    if (api) setTitle(api.view.title);
  }

  return (
    <div>
      <PageHeader
        title="Calendar"
        description="Schedule, review and reschedule content by dragging items to a new date."
        actions={<Button onClick={() => navigate("/content/new")} icon={<Plus size={17} />}>Create Content</Button>}
      />
      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        <div className="border-b border-line p-3 sm:p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-between gap-3">
              <div className="flex overflow-hidden rounded-lg border border-line bg-paper">
                <button
                  type="button"
                  onClick={() => moveCalendar("prev")}
                  className="grid h-11 w-11 place-items-center border-r border-line text-ink hover:bg-white"
                  aria-label="Previous"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => moveCalendar("next")}
                  className="grid h-11 w-11 place-items-center text-ink hover:bg-white"
                  aria-label="Next"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <h2 className="min-w-0 flex-1 text-lg font-extrabold leading-tight sm:text-xl">
                {title || (isMobile ? "This Week" : "This Month")}
              </h2>
              <Button variant="secondary" className="hidden md:inline-flex" onClick={() => moveCalendar("today")}>
                Today
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2 md:flex">
              {[
                ["dayGridMonth", "Month"],
                ["timeGridWeek", "Week"],
                ["listWeek", "List"],
              ].map(([view, label]) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => changeView(view as CalendarView)}
                  className={cn(
                    "min-h-11 rounded-lg border px-3 text-sm font-extrabold transition",
                    activeView === view
                      ? "border-rosewood bg-rosewood text-white"
                      : "border-line bg-paper text-ink hover:bg-white",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <Button variant="secondary" className="md:hidden" onClick={() => moveCalendar("today")}>
              Today
            </Button>
          </div>
        </div>
        <div className="planner-calendar p-2 sm:p-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView={isMobile ? "listWeek" : "dayGridMonth"}
          headerToolbar={false}
          height="auto"
          editable
          dayMaxEvents={isMobile ? 1 : 3}
          moreLinkClick="popover"
          nowIndicator
          allDaySlot={false}
          slotMinTime="08:00:00"
          slotMaxTime="23:00:00"
          dateClick={handleDateClick}
          eventClick={(arg) => navigate(`/content/${arg.event.id}`)}
          eventDrop={handleDrop}
          datesSet={(arg) => {
            setTitle(arg.view.title);
            setActiveView(arg.view.type as CalendarView);
          }}
          events={content
            .filter((item) => item.scheduledDate)
            .map((item) => ({
              id: item.id,
              title: item.title,
              start: item.scheduledDate!,
              extendedProps: item,
            }))}
          eventContent={(arg) => {
            const item = arg.event.extendedProps;
            const compact = isMobile && arg.view.type !== "listWeek";
            return (
              <div className={cn("min-w-0", compact ? "px-1 py-0.5" : "p-1")}>
                <p className={cn("truncate font-extrabold", compact ? "text-[11px]" : "text-xs")}>{arg.event.title}</p>
                {!compact && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span className="text-[10px] font-bold">{titleCase(item.platforms?.[0] ?? "")}</span>
                    <span className="text-[10px] font-bold">{titleCase(item.format ?? "")}</span>
                    <span className="text-[10px] font-bold">{titleCase(item.status ?? "")}</span>
                  </div>
                )}
              </div>
            );
          }}
        />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm text-ink/60">
        <StatusBadge status="idea" />
        <StatusBadge status="editing" />
        <StatusBadge status="ready" />
        <StatusBadge status="published" />
      </div>
    </div>
  );
}
