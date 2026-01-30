import random
from faker import Faker
from app.database import SessionLocal
from app.models.user import User
from app.models.post import Post, PostImage
from app.models.comment import Comment
from app.models.reaction import PostReaction

fake = Faker('ko_KR')
db = SessionLocal()

# 카테고리 리스트 (취향껏 수정하세요)
CATEGORIES = ["한식", "중식", "일식", "양식", "분식", "디저트", "자취요리"]
REACTION_TYPES = ["like", "love", "haha", "wow"]

def seed_everything(num_users=10, posts_per_user=3, comments_per_post=5):
    try:
        print(f"🚀 데이터 생성 시작 (유저 {num_users}명 기준)...")

        # 1. 유저 생성
        users = []
        for _ in range(num_users):
            user = User(
                username=fake.unique.user_name()[:50],
                email=fake.unique.email()[:100],
                hashed_password="hashed_password_1234" # 테스트용 비번
            )
            db.add(user)
            users.append(user)
        db.commit()
        print(f"✅ 유저 {len(users)}명 생성 완료")

        # 2. 게시글(Post) 및 이미지 생성
        posts = []
        for user in users:
            for _ in range(posts_per_user):
                post = Post(
                    user_id=user.id,
                    title=fake.sentence(nb_words=5)[:255],
                    content=fake.text(),
                    image_url=f"https://picsum.photos/seed/{random.randint(1,1000)}/800/600",
                    category=random.choice(CATEGORIES)
                )
                db.add(post)
                posts.append(post)
        db.commit()
        print(f"✅ 게시글 {len(posts)}개 생성 완료")

        # 3. 댓글(Comment) 및 반응(Reaction) 생성
        for post in posts:
            # 댓글 생성
            for _ in range(random.randint(0, comments_per_post)):
                comment = Comment(
                    content=fake.sentence()[:200],
                    post_id=post.id,
                    user_id=random.choice(users).id
                )
                db.add(comment)
            
            # 반응(Reaction) 생성 (유니크 제약조건 때문에 중복 없이 생성)
            reaction_users = random.sample(users, random.randint(1, 5))
            for r_user in reaction_users:
                reaction = PostReaction(
                    post_id=post.id,
                    user_id=r_user.id,
                    reaction_type=random.choice(REACTION_TYPES)
                )
                db.add(reaction)
        
        db.commit()
        print(f"✅ 댓글 및 반응 생성 완료!")
        print("🎉 모든 더미 데이터가 성공적으로 삽입되었습니다!")

    except Exception as e:
        print(f"❌ 에러 발생: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_everything()