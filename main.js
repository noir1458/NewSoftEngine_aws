document.addEventListener("DOMContentLoaded", () => {
  const studentForm = document.getElementById("studentForm");
  const studentList = document.getElementById("studentList");
  const weekSelect = document.getElementById("weekSelect");

  // 페이지가 로드되면 초기 주차에 맞는 학생 목록을 가져옵니다.
  fetchStudents();

  studentForm.addEventListener("submit", function (event) {
      event.preventDefault(); // 폼 제출 시 페이지 리로드 방지

      const name = document.getElementById("name").value;
      const studentNo = document.getElementById("studentNo").value;
      const attendance = document.getElementById("attendance").checked ? 1 : 0; // 출석 체크박스 값 변환

      // 학생 객체 생성
      const student = createStudent(name, studentNo, attendance);

      // 백엔드에 학생 데이터 POST
      createStudentInBackend(student);
  });

  // 학생 객체 생성 함수
  function createStudent(name, studentNo, attendance) {
      return {
          name: name,
          studentNo: studentNo,
          attendance: attendance, // 출석 여부를 숫자로 변환
      };
  }

  // 백엔드에 학생 데이터 POST
  async function createStudentInBackend(student) {
      try {
          const response = await fetch("http://127.0.0.1:8000/api/students/", { // URL 수정
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(student),
          });
          const result = await response.json();
          console.log("Student created:", result);

          // 학생 목록 업데이트
          fetchStudents();
      } catch (error) {
          console.error("Error creating student:", error);
      }
  }

  // 주차 변경 시 학생 목록 업데이트
  weekSelect.addEventListener("change", function () {
      fetchStudents();
  });

  // 학생 리스트 업데이트 함수
  async function fetchStudents() {
      const selectedWeek = weekSelect.value;
      try {
          const response = await fetch(`http://127.0.0.1:8000/api/attendances/week/${selectedWeek}/`); // URL 수정
          const attendances = await response.json();
          updateStudentList(attendances);
      } catch (error) {
          console.error("Error fetching students:", error);
      }
  }

  // 학생 리스트 업데이트 함수
  function updateStudentList(attendances) {
      studentList.innerHTML = ""; // 기존 리스트 초기화

      attendances.forEach((attendance) => {
          const li = document.createElement("li");
          li.textContent = `Student No: ${attendance.studentNo}, Week: ${attendance.week}, 출석 여부: ${
              attendance.attendance_status === 0
                  ? "출석"
                  : attendance.attendance_status === 1
                  ? "결석"
                  : "지각"
          }`;
          studentList.appendChild(li);
      });
  }
});