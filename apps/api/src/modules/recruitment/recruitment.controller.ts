import { Controller, Get } from "@nestjs/common";

@Controller("recruitment")
export class RecruitmentController {
  @Get("pipeline")
  pipeline() {
    return {
      openRequisitions: 68,
      awaitingBudgetApproval: 9,
      interviewsThisWeek: 43,
      offerLettersDrafted: 12,
      aiAssistant: ["Resume screening", "Candidate ranking", "Interview questions", "Offer drafts"]
    };
  }
}
