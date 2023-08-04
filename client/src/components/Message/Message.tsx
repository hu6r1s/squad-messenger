import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { UserState } from "../../States/UserState";

interface MessageType {
  id: number;
  sender: string;
  receiver: string;
  content: string;
}

const Message = () => {
  const navigate = useNavigate();
  const token = useRecoilValue(UserState.token);
  const [selectedTab, setSelectedTab] = useState('send');
  const [receivedMessages, setReceivedMessages] = useState<MessageType[]>([]);
  const [messages, setMessages] = useState({
    receiver: "",
    content: ""
  })

  const handleSendClick = () => {
    setSelectedTab('send');
  };

  const handleReceiveClick = () => {
    setSelectedTab('receive');
  };

  const handleMessageClick = (sender: string) => {
    setSelectedTab("send");
    setMessages({
      receiver: sender,
      content: "",
    })
  }

  const logoutHandler = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_URL}/api/logout`);
      toast.success("안녕히 가세요.")
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(`${process.env.REACT_APP_URL}/api/send`, messages, {
        headers: {
          Authorization: `bearer ${token}`,
        }
      });
      toast.success("메시지 전송 완료.");
      setMessages({
        receiver: "",
        content: ""
      })
    } catch (error) {
      console.log(error)
    }
  }

  const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMessages((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_URL}/api/inbox`, {
      headers: {
        Authorization: `bearer ${token}`,
      }
    }).then((response) => {
      setReceivedMessages(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
            <li className="flex-grow">
              <div onClick={handleSendClick} className={`inline-flex items-center justify-center p-4 ${selectedTab === 'send' ? "text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : "border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"} group`}>
                Send
              </div>
            </li>
            <li className="flex-grow">
              <div onClick={handleReceiveClick} className={`inline-flex items-center justify-center p-4 ${selectedTab === 'receive' ? "text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : "border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"} group`} aria-current="page">
                Receive
              </div>
            </li>
          </ul>
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            {selectedTab === "send" ? (
              <form className="space-y-4 md:space-y-6" onSubmit={submitHandler}>
                <div>
                  <label htmlFor="Receiver" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Receiver</label>
                  <input type="text" name="receiver" value={messages.receiver} onChange={changeHandler} id="receiver" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Receiver" required />
                </div>
                <div>
                  <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Content</label>
                  <textarea name="content" id="message" value={messages.content} onChange={changeHandler} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..." required></textarea>
                </div>
                <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Send</button>
              </form>
            ) : (
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-2 py-3 rounded-l-lg"> {/* Username column */}
                      Sender
                    </th>
                    <th scope="col" className="px-8 py-3"> {/* Message column */}
                      Message Content
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    receivedMessages.length > 0 ? (
                      receivedMessages.map((message) => (
                        <tr key={message.id} className="bg-white dark:bg-gray-800" onClick={() => handleMessageClick(message.sender)}>
                          <td className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {message.sender}
                          </td>
                          <td className="px-8 py-4">
                            {message.content}
                          </td>
                        </tr>
                      ))) : (
                      <tr>
                        <td colSpan={2} className="px-2 py-4 text-center text-gray-500 dark:text-gray-400">
                          No messages found.
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            )}

            <button onClick={logoutHandler} className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Log Out</button>
          </div>
        </div>
      </div>
    </section >
  );
};

export default Message;