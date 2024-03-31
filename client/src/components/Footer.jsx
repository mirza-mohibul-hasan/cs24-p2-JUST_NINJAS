import { Link } from "react-router-dom";
import { BsFacebook, BsInstagram } from "react-icons/bs";
import { AiFillTwitterCircle } from "react-icons/ai";
import { SiMinutemailer } from "react-icons/si";
const Footer = () => {
  return (
    <footer className="mx-auto mb-2 p-10 bg-slate-900 text-neutral-content">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-auto gap-8 py-8">
        <div>
          <div className="flex items-center gap-5">
            <h1 className="text-3xl font-bold">EcoSync</h1>
          </div>
          <p className="text-white mt-2">
            Revolutionizing Waste Management in Dhaka North City Corporation
          </p>
        </div>
        <div className="text-white">
          <h1 className="text-2xl">Contact</h1>
          <ul className="list-none text-[#ffffff] py-2 space-y-2">
            <li>mirzamohibul618@gmail.com</li>
            <li>+880 1991347811</li>
            <div className="flex justify-start gap-4">
              <Link to="https://web.facebook.com/?_rdc=2&_rdr">
                <BsFacebook className="text-xl hover:text-gray-400"></BsFacebook>
              </Link>
              <Link to="https://twitter.com/home">
                <AiFillTwitterCircle className="text-xl hover:text-gray-400"></AiFillTwitterCircle>
              </Link>
              <Link to="https://www.instagram.com/?hl=en">
                <BsInstagram className="text-xl hover:text-gray-400"></BsInstagram>
              </Link>
            </div>
          </ul>
        </div>
        <div className="text-white">
          <h1 className="text-2xl mb-3">Address</h1>
          <p className="text-[#ffffff] my-3">
            Jashore University of Science and Technology
          </p>
          <p className="text-[#ffffff] my-3">
            Jessore-7808, Jashore <br />
            Khulna, abngladesh
          </p>
        </div>
        <div className="text-white">
          <h1 className="text-2xl mb-3">Subscribe</h1>
          <form>
            <div className="bg-white flex justify-between rounded-xl">
              <input
                type="text"
                className="border-none flex-1 rounded-lg p-3"
                placeholder="Email Address"
              />
              <button className="border-2 w-12 rounded-lg">
                <SiMinutemailer className="text-gray-950 w-full text-3xl"></SiMinutemailer>
              </button>
            </div>
          </form>
        </div>
      </section>
      <p className="text-center">ALL RIGHTS RESERVED BY @ JUST NINJAS</p>
    </footer>
  );
};

export default Footer;
