import axios from "axios";
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const Signup = () => {
  const navigate = useNavigate();
  const userRef = useRef<any>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    nickname: undefined,
  });
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [validPassword, setValidPassword] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  useEffect(() => {
    userRef.current?.focus();
  }, [userRef.current]);

  useEffect(() => {
    setValidName(USER_REGEX.test(formData.username));
  }, [formData.username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(formData.password));
  }, [formData.password]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(formData.email));
  }, [formData.email]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    axios.post("http://localhost:3000/api/register", formData).then(() => {
      navigate("/")
    }).catch((error) => {
      console.log(error)
      if (error.response.data.statusCode === 400) {
        toast.error("회원가입 양식에 맞지않습니다.");
      } else if (error.response.data.statusCode === 409) {
        toast.error("이미 존재한 계정입니다.");
      }
    });
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
              <div>
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                <input onFocus={() => setUserFocus(true)} onBlur={() => setUserFocus(false)} type="username" name="username" value={formData.username} id="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Username" onChange={handleChange} required />
                <p
                  className={
                    userFocus && !validName ? "text-red-500 text-sm" : "hidden"
                  }
                >
                  4 ~ 24자 문자로 시작해야 합니다.
                </p>
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input onFocus={() => setPwdFocus(true)} onBlur={() => setPwdFocus(false)} type="password" name="password" value={formData.password} id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange} required />
                <p
                  className={
                    pwdFocus && !validPassword ? "text-red-500 text-sm" : "hidden"
                  }
                >
                  영문자, 숫자, 특수문자로 8 ~ 24자 문자가 있어야 합니다.
                </p>
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input onFocus={() => setEmailFocus(true)} onBlur={() => setEmailFocus(false)} type="email" name="email" value={formData.email} id="email" placeholder="name@company.com" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange} required />
                <p
                  className={
                    emailFocus && !validEmail ? "text-red-500 text-sm" : "hidden"
                  }
                >
                  이메일 형식에 맞게 입력해주세요.
                </p>
              </div>
              <div>
                <label htmlFor="nickname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nickname</label>
                <input type="text" name="nickname" value={formData.nickname} id="nickname" placeholder="default" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange} />
              </div>
              <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Sign up</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;