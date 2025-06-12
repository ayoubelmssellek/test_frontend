import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../../Types/TypesFormStyle.module.css";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchingUpdateType } from "../../../Api/fetchingData/FetchUpdateType";

const UpdateType = ({ onClose, type }) => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [formData, setFormData] = useState({
    name: "",
    status: "avalaible",
  });

  const [error, setError] = useState("");

  // Prefill form data when type is passed
  useEffect(() => {
    if (type) {
      setFormData({
        name: type.name || "",
        status: type.status || "avalaible",
        id: type.id, 
      });
    }
  }, [type]);

  const mutation = useMutation({
    // mutationFn now separates id and updatedData correctly
    mutationFn: ({ id, ...updatedData }) => fetchingUpdateType(id, updatedData),

    onMutate: async (updatedType) => {
      await queryClient.cancelQueries(["types"]);
      const previousTypes = queryClient.getQueryData(["types"]);

      queryClient.setQueryData(["types"], (old = []) =>
        old.map((type) =>
          type.id === updatedType.id ? { ...type, ...updatedType } : type
        )
      );

      return { previousTypes };
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["types"]);
    },

    onError: (_error, _updatedType, context) => {
      queryClient.setQueryData(["types"], context.previousTypes);
      setError(t("errors.update_Type_failed"));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name) {
      setError(t("errors.fill_all_fields"));
      return;
    }

    mutation.mutate(formData);
    
    onClose();
  };

  return (
    <div className={styles.addCategoryModal} dir={isRTL ? "rtl" : "ltr"}>
      <form className={styles.addCategoryForm} onSubmit={handleSubmit}>
        <p className={styles.formTitle}>{t("types.edit_type")}</p>
        {error && <span className={styles.errorMessage}>{error}</span>}

        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder={t("types.enter_type_name")}
            value={formData.name}
            name="name"
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submitButton}>
            {t("types.update_type")}
          </button>
          <button type="button" className={styles.cancelButton} onClick={onClose}>
            {t("common.cancel")}
          </button>
        </div>
      </form>
    </div>
  );
};

UpdateType.propTypes = {
  onClose: PropTypes.func.isRequired,
  type: PropTypes.object.isRequired,
};

export default UpdateType;
