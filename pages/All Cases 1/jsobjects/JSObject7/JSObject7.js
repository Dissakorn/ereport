export default {
  async runAllAndSum() {
    // Wait for 5 seconds before running anything
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Run all 4 queries in parallel
    const [
      prelimWarning,
      prelimLate,
      invesWarning,
      invesLate
    ] = await Promise.all([
      warningPrelim.run(),
      latePrelim.run(),
      warningInves.run(),
      lateInves.run()
    ]);

    // Count totals
    const prelimWarningCount = prelimWarning?.length || 0;
    const prelimLateCount = prelimLate?.length || 0;
    const invesWarningCount = invesWarning?.length || 0;
    const invesLateCount = invesLate?.length || 0;

    const total = prelimWarningCount + prelimLateCount + invesWarningCount + invesLateCount;
    const risk = total > 0;

    // Store values
    await storeValue("totalDelayedCases", total);
    await storeValue("risk", risk);

    // Return breakdown
    return {
      prelimWarningCount,
      prelimLateCount,
      invesWarningCount,
      invesLateCount,
      total,
      risk
    };
  }
}
