export default function Login() {
   return(
   <main className="flex h-screen">
            <div className="w-1/2 bg-blue-800">
            <div className="flex justify-center items-center">
            <img src="/login_image.png" 
                className="w-2/3 h-auto mb-4"
                width={600} 
                height={600}
                style={{marginTop:'10px'}}
            /> 
            </div>
            <h1 className="welcomeText text-white text-center font-mono text-large md:text-xl lg:text-2xl mb-4">
                Welcome to <span className=" text-orange-500">N</span>ear
                <span className="text-orange-500">U</span>live<span className="text-orange-500">S</span>
            </h1>
            <h2 className=" text-white text-center font-mono text-xs md:text-l lg:text-xl">
                Log in to know more about
            </h2>
            <h3 className=" text-white text-center font-mono text-xs md:text-l lg:text-xl"> 
                wonderful events in <span className="text-orange-500">NUS</span>
            </h3>
            </div> {/* Left is half and left empty */}
            <div className="w-1/2 flex justify-center"> 
            {/*items-center: for location of text to center */}
                <div>
                    <h1 className="text-lg">Welcome to NearUliveS</h1>
                    
                </div>
            </div>
        </main>
    );
}