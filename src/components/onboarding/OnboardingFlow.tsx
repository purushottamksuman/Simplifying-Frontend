  // src/components/onboarding/OnboardingFlow.tsx
  import React, { useState, useEffect } from "react";
  import { supabase } from "../../lib/supabase";

  // Student subsections (temporarily reused for all roles)
  import { PropertyStudent1Subsection } from "../../screens/Frame/sections/PropertyStudent1Subsection/PropertyStudent1Subsection";
  import { PropertyStudent2Subsection } from "../../screens/Frame/sections/PropertyStudent2Subsection/PropertyStudent2Subsection";
  import { PropertyStudent3Subsection } from "../../screens/Frame/sections/PropertyStudent3Subsection/PropertyStudent3Subsection";
  import { PropertyStudent4Subsection } from "../../screens/Frame/sections/PropertyStudent4Subsection/PropertyStudent4Subsection";
  import { PropertyStudent5Subsection } from "../../screens/Frame/sections/PropertyStudent5Subsection/PropertyStudent5Subsection";
  import { PropertyStudent6Subsection } from "../../screens/Frame/sections/PropertyStudent6Subsection/PropertyStudent6Subsection";
  import { PropertyParent1Subsection } from "../../screens/parent-flow/PropertyParent1Subsection/PropertyParent1Subsection";
  import { PropertyParent2Subsection } from "../../screens/parent-flow/PropertyParent2Subsection/PropertyParent2Subsection";
  import { PropertyParent3Subsection } from "../../screens/parent-flow/PropertyParent3Subsection/PropertyParent3Subsection";
  import { PropertyParent4Subsection } from "../../screens/parent-flow/PropertyParent4Subsection/PropertyParent4Subsection";
  import { PropertyTeacher1Subsection } from "../../screens/teacher-flow/PropertyTeacher1Subsection/PropertyTeacher1Subsection";
  import { PropertyTeacher2Subsection } from "../../screens/teacher-flow/PropertyTeacher2Subsection/PropertyTeacher2Subsection";
  import { PropertyTeacher3Subsection } from "../../screens/teacher-flow/PropertyTeacher3Subsection/PropertyTeacher3Subsection";
  import { PropertyTeacher4Subsection } from "../../screens/teacher-flow/PropertyTeacher4Subsection/PropertyTeacher4Subsection";
  


  import { DivSubsection } from "../../screens/Frame/sections/DivSubsection/DivSubsection";
  import { SectionComponentNodeSubsection } from "../../screens/Frame/sections/SectionComponentNodeSubsection/SectionComponentNodeSubsection";

  type FormData = {
    full_name?: string;
    dob?: string;
    edu_level?: string;
    career_domain?: string;
    hobbies?: string[] | string;
    goals?: string;
    lang_pref?: string;
    ref_source?: string;
  };

  export const OnboardingFlow: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({});
    const [userId, setUserId] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    type UserType = "student" | "teacher" | "parent";
    const [userType, setUserType] = useState<UserType>("student");
   const roleStepsCount = {
  student: 8,
  teacher: 5,
  parent: 5,
};
const totalSteps = roleStepsCount[userType];

    // Fetch user info from Supabase Auth
    useEffect(() => {
      const fetchUser = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user:", error);
          return;
        }
        const user = data.user;
        if (!user) {
          console.error("No user found!");
          return;
        }
        setUserId(user.id);
        setEmail(user.email);
        setUserType(user.user_metadata?.user_type || "student");

        await supabase.from("user_profiles").upsert(
          {
            id: user.id,
            email: user.email,
            user_type: user.user_metadata?.user_type || "student",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );

      };
      fetchUser();
    }, []);

    const saveStepToDB = async (partial: Partial<FormData>) => {
      if (!userId || !email) {
        console.error("Missing required fields (userId or email). Cannot save step.");
        return false;
      }

      const payload = {
        id: userId,
        email,
        user_type: userType,
        ...formData,
        ...partial,
      };

      const { error } = await supabase
        .from("user_profiles")
        .upsert(payload, { onConflict: "id" });

      if (error) {
        console.error("Onboarding save error:", error);
        return false;
      }

      setFormData((p) => ({ ...p, ...partial }));
      return true;
    };

    const handleNext = async (fieldKey: keyof FormData, value: any) => {
      const partial = { [fieldKey]: value } as Partial<FormData>;
      const ok = await saveStepToDB(partial);
      if (!ok) return;

      if (step >= totalSteps) {
        await supabase.from("user_profiles").upsert(
          {
            id: userId!,
            email: email!,
             user_type: userType,
            onboarded: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
        onFinish?.();
      } else {
        setStep((s) => s + 1);
      }
    };

    const handleBack = () => setStep((s) => Math.max(1, s - 1));

    const handleSkip = async () => {
  if (userId && email) {
    await supabase.from("user_profiles").upsert({
      id: userId,
      email,
      user_type: userType,
      onboarded: true,
      updated_at: new Date().toISOString(),
    });
  }
  onFinish?.();
};



    // Common steps for all roles
    const renderCommonSteps = () => (
      <>
        {step === 1 && (
          <DivSubsection
            initialValue={formData.full_name}
            onNext={(val: string) => handleNext("full_name", val)}
          />
        )}
      </>
    );

    // Role-based steps (currently all reuse student subsections)
    const renderRoleSteps = () => {
      switch (userType) {
        case "teacher":
          return (
            <>
              {step === 2 && (
                <PropertyTeacher1Subsection
                  initialValue={formData.edu_level}
                  onNext={(val: string) => handleNext("edu_level", val)}
                />
              )}
              {step === 3 && (
                <PropertyTeacher2Subsection
                  initialValue={formData.career_domain}
                  onNext={(val: string) => handleNext("career_domain", val)}
                  onBack={handleBack}
                />
              )}
              {step === 4 && (
                <PropertyTeacher3Subsection
                  initialValue={formData.hobbies}
                  onNext={(val: string) => handleNext("hobbies", val)}
                  onBack={handleBack}
                />
              )}
              {step === 5 && (
              <PropertyTeacher4Subsection
              initialValue = {formData.ref_source}
              onNext={(val: string) => handleNext("ref_source", val)}
              />
            )}
            </>
          );

        case "parent":
          return (
            <>
              {step === 2 && (
                <PropertyParent1Subsection
                  initialValue={formData.edu_level}
                  onNext={(val: string) => handleNext("edu_level", val)}
                />
              )}
              {step === 3 && (
                <PropertyParent2Subsection
                  initialValue={formData.career_domain}
                  onNext={(val: string) => handleNext("career_domain", val)}
                  onBack={handleBack}
                />
              )}
              {step === 4 && (
                <PropertyParent3Subsection
                  initialValue={formData.hobbies}
                  onNext={(val: string) => handleNext("hobbies", val)}
                  onBack={handleBack}
                />
              )}
              {step === 5 && (
              <PropertyParent4Subsection
              initialValue = {formData.ref_source}
              onNext={(val: string) => handleNext("ref_source", val)}
              />
            )}
            </>
          );

        case "student":
        default:
          return (
            <>
          {step === 2 && (
          <SectionComponentNodeSubsection
            initialValue={formData.dob}
            onNext={(val: string) => handleNext("dob", val)}
          />
        )}
              {step === 3 && (
                <PropertyStudent1Subsection
                  initialValue={formData.edu_level}
                  onNext={(val: string) => handleNext("edu_level", val)}
                />
              )}
              {step === 4 && (
                <PropertyStudent2Subsection
                  initialValue={formData.career_domain}
                  onNext={(val: string) => handleNext("career_domain", val)}
                  onBack={handleBack}
                />
              )}
              {step === 5 && (
                <PropertyStudent3Subsection
                  initialValue={formData.hobbies}
                  onNext={(val: string) => handleNext("hobbies", val)}
                  onBack={handleBack}
                />
              )}
              {step === 6 && (
                <PropertyStudent4Subsection
                  initialValue={formData.goals}
                  onNext={(val: string) => handleNext("goals", val)}
                  onBack={handleBack}
                />
              )}

              {step === 7 && (
                <PropertyStudent5Subsection
                  initialValue={formData.lang_pref}
                  onNext={(val: string) => handleNext("lang_pref", val)}
                  onBack={handleBack}
                />
              )}
              {step === 8 && (
                <PropertyStudent6Subsection
                  initialValue={formData.ref_source}
                  onNext={(val: string) => handleNext("ref_source", val)}
                  onBack={handleBack}
                />
              )}
            </>
          );
          
      }
    };
        if (!userId || !email) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="text-white text-lg">Loading...</div>
        </div>
      );
    }


    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="relative w-[980px] max-w-full mx-4">
          {renderCommonSteps()}
          {renderRoleSteps()}

          {/* Skip button */}
          <div className="absolute top-4 right-4">
            <button className="text-sm text-gray-600" onClick={handleSkip}>
              Skip
            </button>
          </div>
        </div>
      </div>
    );
  };
