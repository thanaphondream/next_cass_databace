// "use client";
// import Image from "next/image";
// import { useState, useEffect } from "react";
// // import Header from "./Header";

//   // interface Data{
//   //   id: number;
//   //   title: string;
//   //   body: string
//   // }

// export default function Home() {
//   // const [ data, setData ] = useState<Data[]>([])
//   // const [ firsName, setFirstName ] = useState<string>("John")
  
//   // const myPlusFunction = (num1: any, num2: number): number => {
//   //   return num1 * num2
//   // }

//   // const result = myPlusFunction(5, 150)

//   // useEffect(() => {
//   //   const fetcData = async () => {
//   //     try{
//   //       const respose = await fetch("https://jsonplaceholder.typicode.com/posts")
//   //       const jsonData = await respose.json()
//   //       setData(jsonData)
//   //     }catch(err){
//   //       console.error("Error fetching data: ", err)
//   //     }
//   //   }
//   //   fetcData()
//   // }, [])
//   // return (
//   //   <div>
//   //     <main>
//   //       {/* <Header title="NextJS + Typescript "/> */}
//   //       <p>My result: {result}</p>
//   //       <ul>
//   //         { data.map((i) => (
//   //           <li key={i.id}>
//   //               <h3>{i.title}</h3>
//   //               <p>{i.body}</p>
//   //           </li>
//   //         ))}
//   //       </ul>
//   //     </main>
//   //   </div>
//   // );

  

//   return (
//   <div>
//     <h1>Home Page</h1>
//     <p>Welcome to the homepage</p>
//      <div style={{ padding: 20 }}>
//       <h1>Welcome to the Home Page</h1>
//       <p>คุณเข้าสู่ระบบแล้วจึงเห็นหน้านี้</p>
//     </div>

//   </div>
// );
// }

// app/login/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePageRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push('/dashboard-layout/Home')
    } else {
      router.replace("/login");
    }
  }, [router]);

  return <p>กำลังโหลด...</p>;
}

