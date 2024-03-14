// Google Apps Script를 사용하여 자동으로 구글 폼을 생성하는 함수
function createTeamMentoringForms() {
  // 사용할 구글 스프레드시트의 고유 ID
  var ssId = '1IQoJL4uFOQSF2N2037fu2iZfOtrD5-XPOjDowr5i0O4'; 
  // 스프레드시트 객체를 가져옴. 여기서는 첫 번째 시트만 사용함
  var sheet = SpreadsheetApp.openById(ssId).getSheets()[0];
  // 스프레드시트의 마지막 행 번호를 가져옴. 데이터가 있는 마지막 행까지 처리하기 위함
  var lastRow = sheet.getLastRow();
  // 생성된 구글 폼을 저장할 '파트 3' 폴더의 고유 ID
  var parentFolderId = '1Ac55KSJdPGuXHJAlgRZr5w21TkbGdjDa';

  // 스프레드시트에 저장된 각 팀의 정보를 순회하며 폼을 생성
  // 팀 데이터는 6행씩 배치되어 있으므로, 반복문을 6씩 증가시키며 처리
  for (var i = 2; i <= lastRow; i += 6) { 
    // 현재 행(A열)에서 팀 번호를 읽어옴
    var teamNumber = sheet.getRange(i, 1).getValue();
    // 현재 행(B열)에서 멘토 이름을 읽어옴
    var mentorName = sheet.getRange(i, 2).getValue();
    // 수강생 이름을 저장할 빈 배열 초기화
    var students = [];
    // 현재 팀의 수강생 이름을 읽어오기 위해 5개 행을 순회
    for (var j = 0; j < 5; j++) { 
      // C열에서 수강생 이름을 읽어옴
      var studentName = sheet.getRange(i + j, 3).getValue();
      // 읽어온 수강생 이름이 비어있지 않다면 배열에 추가
      if (studentName) students.push(studentName);
    }

    // 구글 폼 생성 및 제목 설정
    var formTitle = '[FE04] 파트3 -' + teamNumber + '팀 멘토링 일지 ' + mentorName + '님';
    //구글폼 설명 설정
    var form = FormApp.create(formTitle)
      .setDescription(`멘토링 후, 멘토링에서 진행된 내용에 대해 간략한 기록을 남겨주세요.

멘토링 일지는 꼭 멘토링 한 번 진행 당 하나씩 작성해서 제출해 주세요.
주에 2회 멘토링을 진행하시면 주에 총 2개의 멘토링 일지가 제출돼야 합니다.
제출하신 멘토링 일지를 기반으로 진행하신 멘토링에 대한 비용을 정산해드리려 하니, 까먹지 말고 꼭 작성해 주시길 부탁드립니다.

멘토링 일지에는 주마다 수강생에 대한 간단한 평가를 남겨주시는 부분이 있는데요.
멘토링 참여에 대한 부분은 매 번 멘토링 일지에 남겨주시고, 코드리뷰에 대한 평가는 주에 1회만 남겨주시면 됩니다.

멘토링 일지 작성 관련 문의사항은 담당 커뮤니티 매니저에게 남겨주시기 바랍니다.
감사합니다.`);


    // 구글 폼에 멘토 이름, 멘토링 날짜, 대화 주제, 받은 질문에 대한 문항 추가
    form.addTextItem().setTitle('멘토님 성함').setRequired(true);
    form.addDateItem().setTitle('멘토링이 진행된 날짜').setRequired(true);
    form.addParagraphTextItem().setTitle('멘토링에서 주로 나눈 대화 주제').setRequired(true);
    form.addParagraphTextItem().setTitle('수강생들에게 받은 질문').setRequired(true);

    // 구글 폼에 수강생들의 참여도와 스프린터의 역량 수준을 평가하는 객관식 그리드 문항 추가
    var gridItem = form.addGridItem();
    gridItem.setTitle('스프린터들이 멘토링에 태도적으로 적극적으로 잘 참여했는지 평가해 주세요.')
      .setRows(students) // 수강생 이름을 행으로 설정
      .setColumns(['🟢 매우 적극', '적극', '보통', '소극', '🔴 매우 소극', '❌ 불참'])
      .setRequired(true);

    var gridItem2 = form.addGridItem();
    gridItem2.setTitle('코드리뷰를 통해 파악한 스프린터의 역량 수준을 평가해 주세요.')
      .setRows(students) // 동일하게 수강생 이름을 행으로 설정
      .setColumns(['🟢 매우 적극', '적극', '보통', '소극', '🔴 매우 소극', '❌ 불참'])
      .setRequired(true);

    // 구글 폼에 운영진에게 전달할 특이사항이나 건의사항을 남길 수 있는 문항 추가
    form.addParagraphTextItem().setTitle('운영진에게 전달하고 싶은 특이사항이나 건의사항이 있다면 남겨주세요.').setRequired(false);

    // 생성된 구글 폼의 파일 객체를 가져옴
    var formFile = DriveApp.getFileById(form.getId());
    // '파트 3' 폴더 객체를 가져옴
    var parentFolder = DriveApp.getFolderById(parentFolderId);
    // 생성된 구글 폼을 '파트 3' 폴더에 추가
    parentFolder.addFile(formFile);
    // 생성된 구글 폼을 구글 드라이브의 루트 폴더에서 제거 (이미 '파트 3' 폴더에 추가되었기 때문)
    DriveApp.getRootFolder().removeFile(formFile);
  }
}
