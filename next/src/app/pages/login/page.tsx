export default function AboutPage() {
   return(
   <main className="flex h-screen">
            <div className="w-1/2"></div> {/* Left is half and left empty */}
            <div className="w-1/2 flex justify-center"> 
            {/*items-center: for location of text to center */}
                <div>
                    <h1 className="text-4xl font-bold mb-4">Orbitals ToDoList</h1>
                    
                    <p className="text-lg">Welcome to NearUliveS</p>
                </div>
            </div>
        </main>
    );
}