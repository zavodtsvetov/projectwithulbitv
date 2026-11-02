import { useEffect, useRef, useState } from "react";
import PostsService from "../components/API/PostsService";
import PostForm from "../components/forms/PostForm";
import MyModal from "../components/MyModal/MyModal";
import PostFilter from "../components/PostFilter/PostFilter";
import PostList from "../components/PostList/PostList";
import MyButton from "../components/UI/button/MyButton";
import Loader from "../components/UI/loader/Loader";
import Pagination from "../components/UI/pagination/Pagination";
import MySelect from "../components/UI/select/MySelect";
import { getPageCount } from "../components/utils/pages";
import { useFetching, usePosts } from "../hooks/index";
import "../styles/App.css";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState({
    sort: "",
    query: "",
  });
  const [modal, setModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
    const response = await PostsService.getAll(limit, page);
    // setPosts([...posts, ...response.data]);
    setPosts(response.data);
    setTotalPages(getPageCount(response.headers["x-total-count"], limit));
  });
  const lastElement = useRef();
  // useObserver(lastElement, page < totalPages, isPostsLoading, () =>
  //   setPage(page + 1),
  // );

  useEffect(() => {
    fetchPosts(limit, page);
  }, [page, limit]);

  const createPost = (newPost) => {
    setPosts([...posts, newPost]);
    setModal(false);
  };

  const removePost = (postToDelete) => {
    setPosts(posts.filter((post) => post.id !== postToDelete.id));
  };
  const changePage = (page) => {
    setPage(page);
    // fetchPosts(limit, page);
    // fetchPosts()
  };

  return (
    <>
      <div className="app">
        <MyButton style={{ marginTop: "30px" }} onClick={() => setModal(true)}>
          Добавить новый пост
        </MyButton>
        <MyModal visible={modal} setVisible={setModal}>
          <PostForm create={createPost} />
        </MyModal>
        <PostFilter filter={filter} setFilter={setFilter} />
        <MySelect
          onChange={(selectedLimit) => setLimit(selectedLimit)}
          defaultValue={"Показывать страниц:"}
          value={limit}
          options={[
            { value: 10, name: "10 постов" },
            { value: 20, name: "20 постов" },
            { value: 30, name: "30 постов" },
            { value: -1, name: "показать всё" },
          ]}
        />
        <br />
        {postError && (
          <h1 style={{ display: "flex", justifyContent: "center" }}>
            Ошибка: ${postError}
          </h1>
        )}
        {isPostsLoading && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {" "}
            <Loader />
          </div>
        )}{" "}
        <>
          <Pagination
            page={page}
            changePage={changePage}
            totalPages={totalPages}
          />
          <br />
          <PostList
            remove={removePost}
            posts={sortedAndSearchedPosts}
            title={"Посты про js"}
            visible={modal}
            setVisible={setModal}
          />
          <div
            ref={lastElement}
            style={{ backgroundColor: "white", height: "20px" }}
          ></div>
        </>
        <br />
      </div>
    </>
  );
}
export default Posts;
