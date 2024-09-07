import React, { useMemo, useState } from "react";
import { CircularProgress, Backdrop } from "@mui/material";
import { TagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Delete } from "@mui/icons-material";
import { addCategory, deleteCategory } from "../../api/category_api";
import { useDispatch } from "react-redux";
import { show } from "../../states/alerts";
import DataTable from "react-data-table-component";

function Categories({ categories, refresh }) {
  const [addCat, setAddCat] = useState(false);
  const [name, setName] = useState("");

  const dispatch = useDispatch();

  const columns = useMemo(() => [
    {
      name: "No.",
      selector: (row) => row.no,
      width: "80px",
    },
    {
      name: "Category Name",
      selector: (row) => row.category_name,
      width: "500px",
    },
    {
      name: "Actions",
      cell: function (row) {
        return (
          <div
            onClick={() => {
              handleDelete(row._id);
            }}
            className="cursor-pointer flex flex-row w-[100px] h-full items-center text-sm gap-2"
          >
            <Delete className="" fontSize="inherit" />
            Delete
          </div>
        );
      },
      width: "200px",
    },
  ]);

  const handleAdd = async () => {
    const id = String(Date.now()).slice(5, 13);

    const category = {
      category_id: id,
      category_name: name,
    };

    addCategory(category)
      .then((res) => res.json())
      .then((_) => {
        dispatch(
          show({
            type: "success",
            message: "Category was added successfully.",
            duration: 3000,
            show: true,
          })
        );
        refresh();
        setName("");
        setAddCat(false);
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          show({
            type: "error",
            message: "Failed to add category.",
            duration: 3000,
            show: true,
          })
        );
      });
  };

  const handleDelete = async (id) => {
    deleteCategory(id)
      .then((res) => res.json())
      .then((_) => {
        dispatch(
          show({
            type: "success",
            message: "Category was deleted successfully.",
            duration: 3000,
            show: true,
          })
        );
        refresh();
        setName("");
        setAddCat(false);
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          show({
            type: "error",
            message: "Failed to delete category.",
            duration: 3000,
            show: true,
          })
        );
      });
  };

  const statusBuilder = (state) => {
    if (state == 2) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center pb-8">
          <h1 className="font-lato text-lg ">No categories.</h1>
        </div>
      );
    }

    if (state == -1) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center pb-8">
          <h1 className="font-lato text-lg ">Oops, an error occurred.</h1>
        </div>
      );
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center pb-8 gap-4">
        <CircularProgress color="inherit" className="text-[#ffc100]" />
        <h1 className="font-lato">Loading, please wait...</h1>
      </div>
    );
  };

  return (
    <div className="w-full h-full p-4 text-[#555C68]">
      <div className="w-full h-full flex flex-col gap-4">
        <div className="w-full bg-white border rounded-lg px-4 py-4 flex flex-row justify-between items-center">
          <h1 className="font-lato-bold text-base">Categories</h1>
          <div className="flex flex-row gap-2 select-none items-center px-2">
            <h1
              onClick={() => {
                setAddCat(true);
              }}
              className="px-2 cursor-pointer flex gap-2 font-lato-bold text-sm text-[#555C68] border border-[#555C68]/40 w-36 shadow-sm py-[6px] rounded-lg justify-center"
            >
              <span>{<TagIcon className="w-5" />}</span>Add Category
            </h1>
          </div>
        </div>
        {categories.fetchState != 1 ? (
          statusBuilder(categories.fetchState)
        ) : (
          <div className="flex flex-col overflow-auto h-full w-full">
            <DataTable
              className="font-roboto rounded-md h-full overflow-hidden"
              columns={columns}
              data={categories["categories"]}
              customStyles={{
                rows: {
                  style: {
                    color: "#607d8b",
                    "font-family": "Lato",
                    "font-size": "14px",
                  },
                },
                headCells: {
                  style: {
                    color: "#607d8b",
                    "font-family": "Lato-Bold",
                    "font-size": "14px",
                    "font-weight": "bold",
                  },
                },
              }}
              persistTableHead
              progressPending={categories.fetchState == 0 ? true : false}
              fixedHeader
              allowOverflow
            />
          </div>
        )}
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={addCat}
      >
        <div className="w-[350px] h-[200px] bg-white rounded-lg text-[#555C68] ">
          <div className="flex flex-col p-4 w-full h-full ">
            <div className="flex flex-row h-1 my-2 items-center justify-between">
              <h1 className="flex gap-2 items-center font-lato-bold">
                Add new Category
              </h1>
              <XMarkIcon
                onClick={() => {
                  setAddCat(false);
                  setName("");
                }}
                className="w-5 cursor-pointer"
              />
            </div>
            <div className="flex flex-col pt-4 w-full">
              <label className="text-sm font-lato-bold">Category name</label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                required
                className="px-2 my-2 w-full h-9 border border-[#555C68]/50 rounded-lg focus:outline-none"
              ></input>
              <button
                className="mt-3 w-full h-9 bg-[#ffc100] font-lato-bold rounded-lg"
                onClick={() => {
                  handleAdd();
                }}
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      </Backdrop>
    </div>
  );
}

export default Categories;
