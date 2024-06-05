document.addEventListener("DOMContentLoaded", () => {
  const createStudentForm = document.getElementById("create-student-form");
  const deleteStudentButton = document.getElementById("delete-student");
  const studentsList = document.getElementById("students-list");
  const weekSelect = document.getElementById("weekSelect");

  // 페이지 로드 시 저장된 주차 값을 설정
  if (localStorage.getItem("selectedWeek")) {
    weekSelect.value = localStorage.getItem("selectedWeek");
  }

  // 학생 생성 POST
  createStudentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const studentNo = parseInt(document.getElementById("studentNo").value); // 학번을 정수로 변환

    try {
      const response = await fetch("http://127.0.0.1:8000/api/students/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, studentNo }),
      });
      const result = await response.json();
      console.log("Student created:", result);
      fetchStudents();
    } catch (error) {
      console.error("Error creating student:", error);
    }
  });

  // 주차 변경 시 학생 목록 업데이트 및 선택한 주차 값 저장
  weekSelect.addEventListener("change", function () {
    localStorage.setItem("selectedWeek", weekSelect.value);
    fetchStudents();
  });

  // 학생 리스트 업데이트 함수
  async function fetchStudents() {
    const selectedWeek = weekSelect.value;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/attendances/week/${selectedWeek}/`);
      const attendances = await response.json();
      updateStudentList(attendances);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }

  // 학생 리스트 업데이트 함수
  function updateStudentList(attendances) {
    studentsList.innerHTML = ""; // 기존 리스트 초기화

    attendances.forEach((attendance) => {
      const listItem = document.createElement("li");
      listItem.id = "student-container";
      const attendanceColorDiv = document.createElement("div");
      attendanceColorDiv.id = "attendance-color";
      const info = document.createElement("p");
      info.innerText = `이름: ${attendance.studentNo.name}\n학번: ${attendance.studentNo.studentNo}`;

      // 출석 상태 변경 함수
      function updateAttendanceColor() {
        if (attendance.attendance_status === 0) {
          attendanceColorDiv.style.backgroundColor = "#3b85cf";
          attendanceColorDiv.innerText = "출석";
        } else if (attendance.attendance_status === 1) {
          attendanceColorDiv.style.backgroundColor = "#F74248";
          attendanceColorDiv.innerText = "결석";
        } else {
          attendanceColorDiv.style.backgroundColor = "#EDF079";
          attendanceColorDiv.innerText = "지각";
        }
      }

      // 초기 상태 설정
      updateAttendanceColor();

      // 클릭 이벤트로 출석 상태 변경
      attendanceColorDiv.addEventListener("click", async () => {
        attendance.attendance_status = (attendance.attendance_status + 1) % 3; // 0, 1, 2 순환
        updateAttendanceColor();

        try {
          const response = await fetch(`http://127.0.0.1:8000/api/attendances/${attendance.id}/`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ attendance_status: attendance.attendance_status }),
          });

          if (!response.ok) {
            throw new Error("Failed to update attendance");
          }
        } catch (error) {
          console.error("Error updating attendance:", error);
        }
      });

      listItem.appendChild(attendanceColorDiv);
      listItem.appendChild(info);

      studentsList.appendChild(listItem);
    });
  }

  // 학생 DELETE
  deleteStudentButton.addEventListener("click", async () => {
    const studentNo = parseInt(document.getElementById("delete-student-id").value); // 학번을 정수로 변환
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/students/${studentNo}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 204) {
        console.log(`Student with No ${studentNo} deleted.`);
        fetchStudents();
      } else {
        console.error("Error deleting student:", response.status);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  });

  // 초기 데이터 로드
  fetchStudents();
});
