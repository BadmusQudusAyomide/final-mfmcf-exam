"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowRight,
  FaBookOpen,
  FaGraduationCap,
  FaIdCard,
  FaPhone,
  FaTimes,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { StudentPortalShell } from "@/components/student-portal-shell";
import { useToast } from "@/components/toast-provider";

const fallbackDepartments = [
  "Choir",
  "Academic/follow-up",
  "Ushering",
  "Technical",
  "Media",
  "Bible-study",
  "Prayer",
  "Welfare",
  "Sanitation",
  "Drama",
  "Evangelism",
];

const fallbackLevels = ["100", "200", "300", "400", "500"];

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    matricNumber: "",
    department: "",
    level: "",
    phoneNumber: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [departments, setDepartments] = useState(fallbackDepartments);
  const [levels, setLevels] = useState(fallbackLevels);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadPortalConfig() {
      try {
        const response = await fetch("/api/portal-config");
        const data = (await response.json()) as {
          exam?: {
            departments?: string[];
            levels?: string[];
          };
        };

        if (data.exam?.departments?.length) {
          setDepartments(data.exam.departments);
        }

        if (data.exam?.levels?.length) {
          setLevels(data.exam.levels);
        }
      } catch (error) {
        console.error(error);
      }
    }

    void loadPortalConfig();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    showToast({
      variant: "info",
      title: "Saving registration",
      description: "Please wait while we prepare your exam access.",
    });

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const payload = (await response.json()) as {
        candidateId?: string;
        error?: string;
      };

      if (!response.ok || !payload.candidateId) {
        setErrorMessage(payload.error ?? "Unable to save registration.");
        showToast({
          variant: "error",
          title: "Registration failed",
          description: payload.error ?? "Unable to save registration right now.",
        });
        return;
      }

      showToast({
        variant: "success",
        title: "Registration saved",
        description: "Your details are saved. Read the instructions before starting.",
      });
      router.push(`/instruction?candidateId=${payload.candidateId}`);
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong while saving registration.");
      showToast({
        variant: "error",
        title: "Something went wrong",
        description: "We could not save your registration. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <StudentPortalShell
      title={"MFMCF UNIOSUN\nOSOGBO CAMPUS"}
      titleLabel="STUDENT PORTAL"
    >
      <main className="flex flex-1 items-center justify-center px-5 py-5">
        <div className="w-full max-w-[500px] overflow-hidden rounded-[10px] border-t-[5px] border-t-[#ba124f] bg-white p-[30px] text-center shadow-[0_10px_30px_rgba(0,0,0,0.1)] before:absolute before:top-0 before:left-0 before:h-[5px] before:w-full before:bg-[#e4cef1] before:content-[''] motion-safe:animate-[fadeInDown_0.8s_ease-out,pulse_2s_infinite_1s] relative max-md:p-5 max-[480px]:p-[15px]">
          <div className="mb-5 text-[3rem] text-[#ba124f] max-md:text-[2.5rem]">
            <FaBookOpen className="inline-block" />
          </div>
          <h3 className="mb-5 text-2xl font-semibold text-[#ba124f] max-md:text-[1.3rem]">
            Available Exam
          </h3>
          <div className="mb-[25px] flex items-center justify-center rounded-lg bg-[#f8f9fa] p-[15px] transition duration-300 hover:-translate-y-[3px]">
            <FaArrowRight className="mr-[10px] text-[1.2rem] text-[#ba124f]" />
            <span className="font-medium">Discipleship/Stewardship Class Exam</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(true);
              showToast({
                variant: "info",
                title: "Complete your registration",
                description: "Enter your details to continue to the exam instructions.",
              });
            }}
            className="cursor-pointer rounded-[30px] bg-[#ba124f] px-[30px] py-3 text-base font-semibold text-white shadow-[0_4px_15px_rgba(186,18,79,0.3)] transition duration-300 hover:-translate-y-[3px] hover:bg-[#9a0e40] hover:shadow-[0_6px_20px_rgba(186,18,79,0.4)]"
          >
            Take Exam
          </button>
        </div>
      </main>

      {isModalOpen ? (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 px-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-[500px] rounded-[10px] bg-white p-[30px] motion-safe:animate-[fadeInUp_0.5s_ease-out] max-[480px]:p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-[15px] right-5 cursor-pointer text-2xl text-[#ba124f] transition duration-300 hover:rotate-90"
              aria-label="Close registration modal"
            >
              <FaTimes />
            </button>

            <h2 className="mb-5 text-center text-2xl text-[#ba124f]">Exam Registration</h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block font-semibold text-[#555]">
                  <FaUser className="mr-2 inline text-[#ba124f]" /> Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, fullName: event.target.value }))
                  }
                  placeholder="Enter your full name"
                  className="w-full rounded-md border border-[#ddd] px-[15px] py-3 text-base transition focus:border-[#ba124f] focus:outline-none focus:ring-4 focus:ring-[rgba(186,18,79,0.1)]"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-[#555]">
                  <FaIdCard className="mr-2 inline text-[#ba124f]" /> Matric Number
                </label>
                <input
                  type="text"
                  value={formData.matricNumber}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, matricNumber: event.target.value }))
                  }
                  placeholder="Enter your matric number"
                  className="w-full rounded-md border border-[#ddd] px-[15px] py-3 text-base transition focus:border-[#ba124f] focus:outline-none focus:ring-4 focus:ring-[rgba(186,18,79,0.1)]"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-[#555]">
                  <FaUsers className="mr-2 inline text-[#ba124f]" /> Church Department
                </label>
                <select
                  value={formData.department}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, department: event.target.value }))
                  }
                  className="w-full appearance-none rounded-md border border-[#ddd] bg-white px-[15px] py-3 text-base transition focus:border-[#ba124f] focus:outline-none focus:ring-4 focus:ring-[rgba(186,18,79,0.1)]"
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-[#555]">
                  <FaGraduationCap className="mr-2 inline text-[#ba124f]" /> Level
                </label>
                <select
                  value={formData.level}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, level: event.target.value }))
                  }
                  className="w-full appearance-none rounded-md border border-[#ddd] bg-white px-[15px] py-3 text-base transition focus:border-[#ba124f] focus:outline-none focus:ring-4 focus:ring-[rgba(186,18,79,0.1)]"
                >
                  <option value="">Select Level</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level} Level
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-[#555]">
                  <FaPhone className="mr-2 inline text-[#ba124f]" /> Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, phoneNumber: event.target.value }))
                  }
                  placeholder="Enter your phone number"
                  className="w-full rounded-md border border-[#ddd] px-[15px] py-3 text-base transition focus:border-[#ba124f] focus:outline-none focus:ring-4 focus:ring-[rgba(186,18,79,0.1)]"
                />
              </div>

              {errorMessage ? (
                <p className="rounded-md bg-[rgba(244,67,54,0.08)] px-4 py-3 text-sm text-[#f44336]">
                  {errorMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 block w-full rounded-md bg-[#ba124f] px-5 py-3 text-center text-base font-semibold text-white transition duration-300 hover:bg-[#9a0f41] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Saving..." : "Proceed to Exam"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </StudentPortalShell>
  );
}
