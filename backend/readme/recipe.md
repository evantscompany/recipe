방금 구현한 좋아요/별로예요(Reaction) 시스템까지 반영하여, 기획서의 화룡점정을 찍어보겠습니다. 이제 이 문서는 단순한 게시판을 넘어 상호작용 기반의 커뮤니티 플랫폼 설계도가 되었습니다.

📄 [최종형] 레시피 커뮤니티 백엔드 시스템 기획 및 요구사항 정의서
1. 개요 (Overview)
본 프로젝트는 사용자가 레시피를 이미지와 함께 기록하고 관리하며, 타 사용자와 댓글 및 리액션(좋아요/별로예요)을 통해 소통할 수 있는 커뮤니티형 백엔드 시스템 개발을 목표로 한다. 리소스의 물리적 관리와 복잡한 데이터 관계(1:N, M:N) 속에서의 무결성 유지를 핵심 가치로 둔다.

2. 프로젝트 목표 (Goals)
FastAPI를 활용한 고성능 비동기 API 서버 구축

User-Post-Comment-Reaction 간의 유기적인 관계 설계

파일 시스템과 DB 간의 완벽한 동기화 (이미지 교체/삭제 최적화)

토글(Toggle) 기반의 리액션 시스템으로 사용자 경험(UX) 극대화

4. 핵심 기능 요구사항 (Functional Requirements)
4.3 댓글(Comment) 시스템
상세 조회 연동: 게시글 상세 조회 시 해당 게시글에 달린 전체 댓글 목록을 시간순으로 자동 JOIN하여 응답.

소유권 검증: 작성자 본인 확인 후 수정/삭제 권한 부여.

4.4 리액션 시스템 (신규 추가) 🚀
4.4.1 좋아요/별로예요 토글 (Like/Dislike Toggle)

한 유저가 특정 게시글에 대해 한 종류의 리액션만 남길 수 있도록 제한.

동작 로직:

미참여 상태에서 클릭 시: 신규 생성

동일 리액션 재클릭 시: 삭제 (취소)

반대 리액션 클릭 시: 상태 업데이트 (like ↔ dislike)

4.4.2 실시간 카운팅

게시글 상세 조회 시 실시간으로 해당 글의 like_count와 dislike_count를 집계하여 응답 데이터에 포함.

리액션 API 호출 성공 시 최신 카운트 값을 즉시 반환하여 프론트엔드 동기화 지원.

5. 데이터베이스 요구사항 (Database Requirements)
5.1 테이블 설계 (확장)
5.1.4 리액션 테이블 (post_reactions)

id (PK)

user_id (FK → users.id)

post_id (FK → posts.id)

reaction_type (VARCHAR(20), 'like' 또는 'dislike')

제약조건: UniqueConstraint('user_id', 'post_id') 적용으로 중복 참여 방지.

5.2 테이블 관계 (Relationship)
User : Post = 1 : N

User : Comment = 1 : N

Post : Comment = 1 : N (Cascade Delete)

User : Post (via PostReaction) = M : N (다대다 관계를 중간 테이블로 해소)

7. 비기능 요구사항 (Non-Functional Requirements)
엄격한 데이터 타입: MySQL Dialect에 맞춘 VARCHAR 길이 설정 및 Enum/Literal을 활용한 데이터 정합성 유지.

효율적 쿼리: 상세 조회 시 필요한 정보(작성자, 댓글, 좋아요 수)를 한 번의 흐름으로 처리하여 DB 부하 최소화.

방어적 설계: 본인이 아닌 사용자의 리액션 조작 및 게시글/댓글 수정 시도를 403 에러로 원천 차단.