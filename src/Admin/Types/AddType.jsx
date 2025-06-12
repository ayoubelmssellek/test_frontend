import { useState } from "react";
import PropTypes from "prop-types";
import styles from "../Types/TypesFormStyle.module.css";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchingAddType } from "../../Api/fetchingData/FetchAddType";
const AddType = ({ onClose }) => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [formData, setFormData] = useState({
    name: "",
    status:"avalaible"
  });

  const [error, setError] = useState("");


  const mutation = useMutation({
    mutationFn: fetchingAddType,

    onMutate: async (newType) => {
      await queryClient.cancelQueries(["types"]);
      const previousTypes = queryClient.getQueryData(["types"]);

      const tempType = {
        ...newType,
        tempId: Date.now(),
      };

      queryClient.setQueryData(["types"], (old = []) => [...old, tempType]);
      return { previousTypes, tempId: tempType.tempId };
    },

    onSuccess: () => {
        queryClient.invalidateQueries(["types"]);
    },

    onError: (_error, _newType, context) => {
      queryClient.setQueryData(["types"], context.previousTypes);
      setError(t("errors.add_Type_failed"));
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
        <p className={styles.formTitle}>{t("types.add_type")}</p>
        {error && <span className={styles.errorMessage}>{error}</span>}

        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder={t("types.enter_type_name")}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submitButton}>
            {t("types.add_type")}
          </button>
          <button type="button" className={styles.cancelButton} onClick={onClose}>
            {t("common.cancel")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddType;

AddType.propTypes = {
  onClose: PropTypes.func.isRequired,
};
