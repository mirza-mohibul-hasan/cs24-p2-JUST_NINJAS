import truck from '../../../public/truck.png'


const Home = () => {
  return (
    <div className='px-5'>
      <div className='bg-[#F8CF40] rounded-2xl flex justify-center'>
         <img src={truck} alt="" className='w-[85%]' />  
      </div>
    </div>
  );
};

export default Home;