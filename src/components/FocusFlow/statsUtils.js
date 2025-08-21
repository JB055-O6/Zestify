// Mock function to simulate tracked focus minutes per time slot
export function generateMockFocusData() {
  const timeSlots = ["Morning", "Afternoon", "Evening", "Night"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const mockData = {};

  days.forEach((day) => {
    mockData[day] = {};
    timeSlots.forEach((slot) => {
      // Random 0 to 40 minutes focus data
      mockData[day][slot] = Math.floor(Math.random() * 40);
    });
  });

  return mockData;
}
