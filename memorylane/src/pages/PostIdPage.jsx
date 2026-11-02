import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostsService from "../components/API/PostsService";
import MyButton from "../components/UI/button/MyButton";
import Loader from "../components/UI/loader/Loader";
import { useFetching } from "../hooks";
const PostIdPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [isCommentHidden, setIsCommentsHidden] = useState(true);
  const [fetchPostById, isLoading, error] = useFetching(async (id) => {
    const response = await PostsService.getById(id);
    setPost(response.data);
  });
  const [fetchCommentByPost, isCommentsLoading, commentsError] = useFetching(
    async (id) => {
      const response = await PostsService.getCommentsByPost(id);
      setComments(response.data);
    },
  );

  useEffect(() => {
    fetchPostById(params.id);
    fetchCommentByPost(params.id);
    console.log(params);
  }, [params.id]);

  return (
    <>
      <div>
        <h1>Здесь страница поста с айдишником {params.id}</h1>
        {isLoading ? (
          <Loader />
        ) : post ? (
          <div>
            {" "}
            <div>
              {post.id}. {post.title}
            </div>
            <span>{post.body}</span>
          </div>
        ) : (
          ""
        )}
        {params.id >= 2 && (
          <MyButton onClick={() => navigate(`/posts/${Number(post.id - 1)}`)}>
            Предыдущий пост
          </MyButton>
        )}

        <MyButton onClick={() => navigate("/posts")}>Вернуться назад</MyButton>
        <MyButton onClick={() => navigate(`/posts/${Number(post.id) + 1}`)}>
          След пост
        </MyButton>

        <br />
        <hr />
        <br />
        <MyButton onClick={() => setIsCommentsHidden(false)}>
          Открыть комменты
        </MyButton>
        {!isCommentHidden && (
          <div>
            <h1>Коммы:</h1>
            <div>
              {comments.map((comment) => (
                <div key={comment.id}>{comment.name}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PostIdPage;
