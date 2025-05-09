function sanitizeInput(input) {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}

function calculateMileage(distance, fuel) {
  return (distance / fuel).toFixed(2);
}

describe("sanitizeInput", () => {
  test("should sanitize HTML tags", () => {
    const input = "<script>alert('xss')</script>";
    const output = sanitizeInput(input);
    expect(output).toBe("&lt;script&gt;alert('xss')&lt;/script&gt;");
  });

  test("should leave normal text unchanged", () => {
    const input = "Car";
    const output = sanitizeInput(input);
    expect(output).toBe("Car");
  });
});

describe("calculateMileage", () => {
  test("should return correct mileage", () => {
    expect(calculateMileage(100, 5)).toBe("20.00");
    expect(calculateMileage(300, 15)).toBe("20.00");
  });

  test("should handle floating point inputs", () => {
    expect(calculateMileage(150.5, 7.2)).toBe("20.90");
  });

  test("should return 'Infinity' if fuel is zero", () => {
    expect(calculateMileage(100, 0)).toBe("Infinity");
  });
});
