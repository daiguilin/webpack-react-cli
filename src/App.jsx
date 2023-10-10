import React, { lazy, Suspense } from 'react'
import { Routes, Route, Link } from "react-router-dom"
// import Home from "./pages/home"
// import About from "./pages/about"
const Home = lazy(() => import(/* webpackChunkName: 'home' */'./pages/home'))
const About = lazy(() => import(/* webpackChunkName: 'about' */'./pages/about'))
import {Button} from 'antd'
function App() {
    return <div>
        <h2>app</h2>
        <ul>
            <li><Link to="/home">home</Link></li>
            <li><Link to="/about">about</Link></li>
        </ul>
        <Button type='primary'>按钮</Button>
        <Suspense fallback={<div>loading...</div>}>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Suspense>

    </div>
}

export default App