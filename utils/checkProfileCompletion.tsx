// utils/checkProfileCompletion.ts
export const isProfileIncomplete = (profile: any) => {
   return !profile.full_name ||
   !profile.dob ||
         !profile.education ||
         !profile.career_domain ||
         !profile.hobbies ||
         !profile.goals ||
         !profile.language ||
         !profile.ref_source;
};
