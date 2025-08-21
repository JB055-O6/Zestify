import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "../supabaseClient";
import dayjs from "dayjs";

const FocusDataContext = createContext();

export function FocusDataProvider({ children }) {
  const user = useUser();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("focus"); // "focus" or "break"
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState("");
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [userReady, setUserReady] = useState(false);

  const intervalRef = useRef(null);
  const totalTimeRef = useRef(0);
  const hasSavedSessionRef = useRef(false);

  useEffect(() => {
    if (Notification && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (user) {
      setUserReady(true);
    }
  }, [user]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!userReady || !user?.id) return;

      setLoadingProjects(true);
      const { data, error } = await supabase
        .from("focus_sessions")
        .select("project_name")
        .eq("user_id", user.id);

      if (error) {
        console.error("❌ Error fetching projects:", error.message);
        setLoadingProjects(false);
        return;
      }

      const uniqueProjects = [...new Set(data.map((row) => row.project_name))];
      setProjects(uniqueProjects);

      if (!currentProject && uniqueProjects.length > 0) {
        setCurrentProject(uniqueProjects[0]);
      }

      setLoadingProjects(false);
    };

    fetchProjects();
  }, [userReady]);

  useEffect(() => {
    if (isRunning) {
      hasSavedSessionRef.current = false;

      intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;

        if (newTime <= 0) {
          clearInterval(intervalRef.current);
          setIsRunning(false);

          if (mode === "focus" && !hasSavedSessionRef.current) {
            handleSaveSession();
            hasSavedSessionRef.current = true;
          }

          triggerSessionEndNotification();

          const nextMode = mode === "focus" ? "break" : "focus";
          setMode(nextMode);
          setTimeout(() => startTimer(nextMode), 100);

          return 0;
        }

        return newTime;
      });

      if (mode === "focus") {
        totalTimeRef.current += 1;
      }
    }, 1000);

    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const triggerSessionEndNotification = () => {
    window.focus();
    if (Notification.permission === "granted") {
      new Notification("🎯 Focus Session Ended", {
        body: "Take a 5-minute break to recharge 🧘",
        icon: "/favicon.ico",
      });
    }
  };

  const addProject = (name) => {
    if (!projects.includes(name)) {
      setProjects((prev) => [...prev, name]);
    }
    setCurrentProject(name);
  };

  const startTimer = (selectedMode = mode) => {
    const duration = selectedMode === "focus" ? 25 * 60 : 5 * 60;
    setTimeLeft(duration);
    totalTimeRef.current = 0;
    setIsRunning(true);
    hasSavedSessionRef.current = false;
  };

  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    if (mode === "focus" && !hasSavedSessionRef.current) {
      handleSaveSession();
      hasSavedSessionRef.current = true;
    }
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTimeLeft(0);
    totalTimeRef.current = 0;
    setIsRunning(false);
    hasSavedSessionRef.current = false;
  };

  const switchMode = () => {
    const newMode = mode === "focus" ? "break" : "focus";
    setMode(newMode);
    resetTimer();
    setTimeout(() => startTimer(newMode), 100);
  };

  const getCurrentTimeSlot = () => {
    const hour = dayjs().hour();
    if (hour < 12) return "Morning";
    if (hour < 16) return "Afternoon";
    if (hour < 20) return "Evening";
    return "Night";
  };

  const handleSaveSession = async () => {
    const duration = totalTimeRef.current;
    const project = currentProject;

    if (!user || !project || duration === 0) return;

    const weekday = dayjs().format("dddd");
    const timeSlot = getCurrentTimeSlot();

    const { error } = await supabase.from("focus_sessions").insert([
      {
        user_id: user.id,
        project_name: project,
        duration,
        weekday,
        time_slot: timeSlot,
      },
    ]);

    if (error) {
      console.error("❌ Supabase save failed:", error.message);
    } else {
      console.log("✅ Session saved:", { duration, project, weekday, timeSlot });
    }

    totalTimeRef.current = 0;
  };

  return (
    <FocusDataContext.Provider
      value={{
        timeLeft,
        isRunning,
        mode,
        startTimer,
        pauseTimer,
        resetTimer,
        switchMode,
        projects,
        addProject,
        currentProject,
        setCurrentProject,
        loadingProjects,
        user,
      }}
    >
      {children}
    </FocusDataContext.Provider>
  );
}

export function useFocusData() {
  return useContext(FocusDataContext);
}
