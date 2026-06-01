import { Controller, Get } from "@nestjs/common";

@Controller("attendance")
export class AttendanceController {
  @Get("summary")
  summary() {
    return {
      present: 1182,
      absent: 31,
      lateMarks: 12,
      overtimeHours: 184,
      modes: ["MANUAL", "BIOMETRIC", "GEO_FENCING", "MOBILE", "QR"]
    };
  }
}
