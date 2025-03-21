import React, { useEffect, useState } from "react";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import axiosInstance from "../services/axiosInstance";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { RiDeleteBin3Line } from "react-icons/ri";
import {
  formatAndConvertToPersianNumber,
  converToSimpleEnglishNumber,
} from "../services/formatNumber";

const AddCopon = () => {
  const [codeName, setCodeName] = useState("");
  const [codeDiscount, setCodeDiscount] = useState("");
  const [startDate, setStartDate] = useState(new DateObject());
  const [endDate, setEndDate] = useState(new DateObject());
  const [today, setToday] = useState(new DateObject());
  const [tempCopons, setTempCopons] = useState([]);
  const [copons, setCopons] = useState([]);

  const fetchAllCopons = async () => {
    const response = await axiosInstance.get(backendUrl + "/api/copon/getAll");
    if (response.data.success) {
      setTempCopons(response.data.copons);
    }
  };

  useEffect(() => {
    fetchAllCopons();
  }, []);

  useEffect(() => {
    setCopons(tempCopons);
  }, [tempCopons]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!codeName || !codeDiscount || !startDate || !endDate) {
      toast.error("لطفاً تمامی فیلدها را پر کنید!");
      return;
    }
    const discount = converToSimpleEnglishNumber(codeDiscount);

    if (isNaN(discount)) {
      toast.error("مبلغ تخفیف باید عدد باشد!");
      return;
    }

    if (startDate > endDate) {
      toast.error("خطا در انتخاب بازه زمانی!");
      return;
    }

    // تبدیل تاریخ به شمسی
    const startDateShamsi = startDate.format("YYYY/MM/DD"); // تاریخ شروع
    const endDateShamsi = endDate.format("YYYY/MM/DD"); // تاریخ پایان

    const coponData = {
      codeName,
      codeDiscount: Number(discount),
      startDate: startDateShamsi,
      endDate: endDateShamsi,
    };

    try {
      const response = await axiosInstance.post(
        backendUrl + "/api/copon/add",
        coponData
      );

      if (response.data.success) {
        fetchAllCopons();
        toast.success("کوپن با موفقیت ثبت شد!");
        setCodeName("");
        setCodeDiscount("");
        setStartDate(new DateObject());
        setEndDate(new DateObject());
      } else {
        toast.error("ثبت کوپن ناموفق بود!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("خطا در ارسال درخواست!");
    }
  };

  const status = (startDate, endDate) => {
    const todayShamsi = today.format("YYYY/MM/DD");

    if (todayShamsi < startDate) {
      return "شروع‌نشده";
    } else if (todayShamsi >= startDate && todayShamsi < endDate) {
      return "درجریان";
    } else {
      return "منقضی‌شده ";
    }
  };

  const deleteHandler = async (coponId) => {
    try {
      await axiosInstance.post(backendUrl + "/api/copon/remove", { coponId });
      setCopons(copons.filter((c) => c._id !== coponId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const rawValue = e.target.value;
    const formatted = formatAndConvertToPersianNumber(rawValue);
    setCodeDiscount(formatted);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between">
      <form onSubmit={submitHandler} className="flex flex-col w-[200px]">
        <div className="flex flex-col sm:flex-row sm:gap-5">
          <div className="mb-2">
            <p className="text-sm mb-1">کد تخفیف</p>
            <input
              onChange={(e) => setCodeName(e.target.value)}
              value={codeName}
              className="w-[200px] px-2 py-1"
              type="text"
              required
            />
          </div>
          <div className="mb-2">
            <p className="text-sm mb-1">مبلغ تخفیف (تومان)</p>
            <input
              onChange={handleChange}
              value={codeDiscount}
              className="w-[200px] px-2 py-1"
              type="text"
              required
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:gap-5">
          <div className="mb-2">
            <p className="text-sm">انتخاب تاریخ شروع</p>
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              calendar={persian}
              locale={persian_fa}
              calendarPosition="bottom-left"
            />
          </div>
          <div>
            <p className="text-sm">انتخاب تاریخ پایان</p>
            <DatePicker
              value={endDate}
              onChange={setEndDate}
              calendar={persian}
              locale={persian_fa}
              calendarPosition="bottom-left"
            />
          </div>
          {/*این یک بخش مخفی است که فقط میخوام تاریخ امروز رو ذخیره کنم */}
          <div className="hidden">
            <DatePicker
              value={today}
              onChange={setToday}
              calendar={persian}
              locale={persian_fa}
              calendarPosition="bottom-left"
            />
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-[86px] py-2 rounded-md bg-[#15224c] text-white mt-5"
          >
            ثبت
          </button>
        </div>
      </form>
      <div className="lg:w-1/2">
        <div className="w-full border flex justify-center py-2 mt-7 lg:mt-0 bg-slate-100 text-xl text-[#15224c]">
          کدهای تخفیف ثبت شده
        </div>
        <div className="flex my-2 text-sm">
          <p>تاریخ امروز : </p>
          <p className="mr-1">{today.format("YYYY/MM/DD")}</p>
        </div>
        <table className="table text-xs lg:text-sm mt-2 w-full">
          <tr className="grid grid-cols-6 border-b p-1">
            <th className="text-right">نام کد </th>
            <th className="text-right">مبلغ </th>
            <th className="text-right">شروع</th>
            <th className="text-right">پایان</th>
            <th className="text-right">وضعیت</th>
            <th></th>
          </tr>
          {copons.reverse().map((item) => (
            <tr key={item._id} className="grid grid-cols-6 border-b p-1">
              <td>{item.codeName}</td>
              <td className="">
                {formatAndConvertToPersianNumber(String(item.codeDiscount))}
              </td>
              <td>{item.startDate}</td>
              <td>{item.endDate}</td>
              <td
                style={{
                  color:
                    status(item.startDate, item.endDate) === "درجریان"
                      ? "green"
                      : "red",
                }}
              >
                {status(item.startDate, item.endDate)}
              </td>
              <td className="cursor-pointer mx-auto">
                <RiDeleteBin3Line
                  onClick={() => deleteHandler(item._id)}
                  size={20}
                />
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default AddCopon;
