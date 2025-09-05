import React from "react";
import { DivSubsection } from "./sections/DivSubsection/DivSubsection";
import { DivWrapperSubsection } from "./sections/DivWrapperSubsection/DivWrapperSubsection";
import { OverlapWrapperSubsection } from "./sections/OverlapWrapperSubsection/OverlapWrapperSubsection";
import { PropertyClubAndSubsection } from "./sections/PropertyClubAndSubsection/PropertyClubAndSubsection";
import { PropertyCommanSubsection } from "./sections/PropertyCommanSubsection/PropertyCommanSubsection";
import { PropertyDasboardSubsection } from "./sections/PropertyDasboardSubsection/PropertyDasboardSubsection";
import { PropertyLiveSubsection } from "./sections/PropertyLiveSubsection/PropertyLiveSubsection";
import { PropertyLoginSubsection } from "./sections/PropertyLoginSubsection/PropertyLoginSubsection";
import { PropertyMycourseSubsection } from "./sections/PropertyMycourseSubsection/PropertyMycourseSubsection";
import { PropertyOtpSubsection } from "./sections/PropertyOtpSubsection/PropertyOtpSubsection";
import { PropertyRaiseAndSubsection } from "./sections/PropertyRaiseAndSubsection/PropertyRaiseAndSubsection";
import { PropertyRaiseSubsection } from "./sections/PropertyRaiseSubsection/PropertyRaiseSubsection";
import { PropertyReffrealSubsection } from "./sections/PropertyReffrealSubsection/PropertyReffrealSubsection";
import { PropertyRewardSubsection } from "./sections/PropertyRewardSubsection/PropertyRewardSubsection";
import { PropertyStudent1Subsection } from "./sections/PropertyStudent1Subsection/PropertyStudent1Subsection";
import { PropertyStudent2Subsection } from "./sections/PropertyStudent2Subsection/PropertyStudent2Subsection";
import { PropertyStudent3Subsection } from "./sections/PropertyStudent3Subsection/PropertyStudent3Subsection";
import { PropertyStudent4Subsection } from "./sections/PropertyStudent4Subsection/PropertyStudent4Subsection";
import { PropertyStudent5Subsection } from "./sections/PropertyStudent5Subsection/PropertyStudent5Subsection";
import { PropertyStudent6Subsection } from "./sections/PropertyStudent6Subsection/PropertyStudent6Subsection";
import { PropertyStudentSubsection } from "./sections/PropertyStudentSubsection/PropertyStudentSubsection";
import { PropertyStudentWrapperSubsection } from "./sections/PropertyStudentWrapperSubsection/PropertyStudentWrapperSubsection";
import { PropertySubsection } from "./sections/PropertySubsection/PropertySubsection";
import { PropertyTestAndSubsection } from "./sections/PropertyTestAndSubsection/PropertyTestAndSubsection";
import { PropertyWrapperSubsection } from "./sections/PropertyWrapperSubsection/PropertyWrapperSubsection";
import { SectionComponentNodeSubsection } from "./sections/SectionComponentNodeSubsection/SectionComponentNodeSubsection";

export const Frame = (): JSX.Element => {
  return (
    <main className="bg-transparent w-full min-h-screen">
      <div className="w-full overflow-x-auto">
        <div className="flex min-w-max rounded-[5px] border border-dashed border-[#8a38f5] p-5">
          <PropertyDasboardSubsection />
          <PropertyOtpSubsection />
          <PropertyMycourseSubsection />
          <PropertyStudent6Subsection />
          <PropertyStudent4Subsection />
          <PropertyClubAndSubsection />
          <PropertyRewardSubsection />
          <DivSubsection />
          <PropertyRaiseAndSubsection />
          <PropertyStudentSubsection />
          <PropertyStudentWrapperSubsection />
          <PropertyCommanSubsection />
          <DivWrapperSubsection />
          <PropertyStudent1Subsection />
          <PropertyStudent5Subsection />
          <SectionComponentNodeSubsection />
          <OverlapWrapperSubsection />
          <PropertySubsection />
          <PropertyReffrealSubsection />
          <PropertyStudent2Subsection />
          <PropertyLiveSubsection />
          <PropertyWrapperSubsection />
          <PropertyTestAndSubsection />
          <PropertyStudent3Subsection />
          <PropertyRaiseSubsection />
          <PropertyLoginSubsection />
        </div>
      </div>
    </main>
  );
};
