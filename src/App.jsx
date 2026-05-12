import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ShowCreators from './pages/ShowCreators.jsx'
import ViewCreator from './pages/ViewCreator.jsx'
import AddCreator from './pages/AddCreator.jsx'
import EditCreator from './pages/EditCreator.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ShowCreators />} />
        <Route path="creator/:id" element={<ViewCreator />} />
        <Route path="add" element={<AddCreator />} />
        <Route path="edit/:id" element={<EditCreator />} />
      </Route>
    </Routes>
  )
}
