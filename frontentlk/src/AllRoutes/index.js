import Auth from "../check/Auth";
import Admin from "../check/Admin";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import React, { Suspense } from "react";
import GuestHeader from "../sections/Header/Guest";
import AuthHeader from "../sections/Header/Auth";
import AdminHeader from "../sections/Header/Admin";
import Footer from "../sections/Index/Footer";
import NotFound from "../pages/NotFound";
import Loader from "../sections/Loader";
import Link from "../pages/Link";
import Login from "../pages/Guest/Login";
import Register from "../pages/Guest/Register";
import New from "../pages/Auth/New";
import Help from "../pages/Auth/Help";
import NewLink from "../pages/Auth/NewLink";

const AMain = React.lazy(() => import("../pages/Auth/Main"));
const Finance = React.lazy(() => import("../pages/Auth/Finance"));
const News = React.lazy(() => import("../pages/Auth/News"));
const Catalog = React.lazy(() => import("../pages/Auth/Catalog"));
const Edit = React.lazy(() => import("../pages/Auth/Edit"));
const View = React.lazy(() => import("../pages/Auth/View"));
const Settings = React.lazy(() => import("../pages/Auth/Settings"));
const Links = React.lazy(() => import("../pages/Auth/Links"));
const EditLink = React.lazy(() => import("../pages/Auth/EditLink"));
const Promos = React.lazy(() => import("../pages/Auth/Promos"));
const NewPromo = React.lazy(() => import("../pages/Auth/NewPromo"));
const EditPromo = React.lazy(() => import("../pages/Auth/EditPromo"));
const ViewPromo = React.lazy(() => import("../pages/Auth/Promo"));
const PromoSuccess = React.lazy(() => import("../pages/Auth/PromoSuccess"));
const ADMain = React.lazy(() => import("../pages/Admin/Main"));
const ACatalog = React.lazy(() => import("../pages/Admin/Catalog"));
const AView = React.lazy(() => import("../pages/Admin/View"));
const ANews = React.lazy(() => import("../pages/Admin/News"));
const AUsers = React.lazy(() => import("../pages/Admin/Users"));
const AFinance = React.lazy(() => import("../pages/Admin/Finance"));
const APromos = React.lazy(() => import("../pages/Admin/Promos"));
const APromo = React.lazy(() => import("../pages/Admin/Promo"));
const Main = React.lazy(() => import("../pages/Main"));
const Terms = React.lazy(() => import("../pages/Terms"));

export default function AllRoutes() {
  const auth = Auth();
  const admin = Admin();
  const location = useLocation();

  const setTitle = () => {
    document.title = "overdose.media";
  };

  return (
    <div>
      {auth ? (
        <>
          {admin && !location.pathname.includes("/l/") && (
            <>
              {setTitle()}
              {location.pathname.includes("admin") ? <AdminHeader /> : <AuthHeader />}
            </>
          )}
          {!admin && !location.pathname.includes("/l/") && (
            <>
              {setTitle()}
              <AuthHeader />
            </>
          )}
          <Routes>
            <Route path="/" element={<Suspense fallback={<Loader />}><AMain /></Suspense>} />
            <Route path="/finance" element={<Suspense fallback={<Loader />}><Finance /></Suspense>} />
            <Route path="/news" element={<Suspense fallback={<Loader />}><News /></Suspense>} />
            <Route path="/new_release" element={<New />} />
            <Route path="/catalog" element={<Suspense fallback={<Loader />}><Catalog /></Suspense>} />
            <Route path="/links" element={<Suspense fallback={<Loader />}><Links /></Suspense>} />
            <Route path="/edit/:id" element={<Suspense fallback={<Loader />}><Edit /></Suspense>} />
            <Route path="/link/edit/:id" element={<Suspense fallback={<Loader />}><EditLink /></Suspense>} />
            <Route path="/link/new" element={<NewLink />} />
            <Route path="/view/:id" element={<Suspense fallback={<Loader />}><View /></Suspense>} />
            <Route path="/settings" element={<Suspense fallback={<Loader />}><Settings /></Suspense>} />
            <Route path="/help" element={<Help />} />
            <Route path="/promos" element={<Suspense fallback={<Loader />}><Promos /></Suspense>} />
            <Route path="/promo/new" element={<Suspense fallback={<Loader />}><NewPromo /></Suspense>} />
            <Route path="/promo/edit/:id" element={<Suspense fallback={<Loader />}><EditPromo /></Suspense>} />
            <Route path="/promo/:id" element={<Suspense fallback={<Loader />}><ViewPromo /></Suspense>} />
            <Route path="/promo/success/:id" element={<Suspense fallback={<Loader />}><PromoSuccess /></Suspense>} />
            <Route path="/terms/:type" element={<Suspense fallback={<Loader />}><Terms /></Suspense>} />
            <Route path="/terms" element={<Navigate to="/terms/partners" />} />
            {admin && (
              <>
                <Route path="/admin" element={<Suspense fallback={<Loader />}><ADMain /></Suspense>} />
                <Route path="/admin/catalog" element={<Suspense fallback={<Loader />}><ACatalog method="get_releases" name="Каталог" /></Suspense>} />
                <Route path="/admin/moderation" element={<Suspense fallback={<Loader />}><ACatalog method="get_moderation" name="На модерации" /></Suspense>} />
                <Route path="/admin/view/:id" element={<Suspense fallback={<Loader />}><AView /></Suspense>} />
                <Route path="/admin/news" element={<Suspense fallback={<Loader />}><ANews /></Suspense>} />
                <Route path="/admin/users" element={<Suspense fallback={<Loader />}><AUsers /></Suspense>} />
                <Route path="/admin/finance" element={<Suspense fallback={<Loader />}><AFinance /></Suspense>} />
                <Route path="/admin/promos" element={<Suspense fallback={<Loader />}><APromos /></Suspense>} />
                <Route path="/admin/promo/:id" element={<Suspense fallback={<Loader />}><APromo /></Suspense>} />
              </>
            )}
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/register" element={<Navigate to="/" />} />
            <Route path="/l/:id" element={<Link />} />
            <Route path="/l" element={<Navigate to="/404" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </>
      ) : (
        <>
          {!location.pathname.includes("/l/") && (
            <>
              {setTitle()}
              <GuestHeader />
            </>
          )}
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/terms/:type" element={<Suspense fallback={<Loader />}><Terms /></Suspense>} />
            <Route path="/terms" element={<Navigate to="/terms/partners" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/l/:id" element={<Link />} />
            <Route path="/l" element={<Navigate to="/404" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          {!location.pathname.includes("/l/") && (
            <>
              {setTitle()}
              <Footer />
            </>
          )}
        </>
      )}
    </div>
  );
}