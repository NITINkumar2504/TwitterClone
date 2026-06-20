import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { toast } from "react-hot-toast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


const CreatePost = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const imgRef = useRef(null);

  const { data : authUser} = useQuery({
    queryKey : ["authUser"]
  }) 
  const queryClient = useQueryClient()

  const {mutate : createPost, isPending} = useMutation({
    mutationFn : async ({text, image}) => {
      try {
        const res = await fetch("/api/posts/create", {
          method : "POST",
          headers : {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({text, image})
        })

        const data = await res.json()
        if(!res.ok) throw new Error(data.error || "Something went wrong")

        return data
      } 
      catch (error) {
        console.error(error)
        throw error
      }
    },
    onSuccess : () => {
      setText("")
      setImage(null)
      toast.success("Post created succesfullyy")
      queryClient.invalidateQueries({queryKey : ["posts"]})
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    },
  }) 

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({text, image})
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser.profileImg || "/avatar-placeholder.png"} />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        
        {image && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-1.5 text-white bg-gray-600 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImage(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={image}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input type="file" hidden accept="image/*" ref={imgRef} onChange={handleImgChange} />
          {showError && <p className='text-red-500'>{errorMessage}</p>}
          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
