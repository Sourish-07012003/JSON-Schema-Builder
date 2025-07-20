import React, { useState } from "react";
import { Card, Input, Select, Button, Typography, Switch } from "antd";

const { Text } = Typography;
const { Option } = Select;

const defaultField = () => ({
  key: "field",
  type: "string",
  children: [],
});

const generateJson = (fields) => {
  const obj = {};
  fields.forEach((field) => {
    switch (field.type) {
      case "nested":
        obj[field.key] = generateJson(field.children);
        break;
      case "number":
        obj[field.key] = 0;
        break;
      case "boolean":
        obj[field.key] = false;
        break;
      case "array":
        obj[field.key] = [];
        break;
      case "date":
        obj[field.key] = new Date().toISOString();
        break;
      case "email":
        obj[field.key] = "example@example.com";
        break;
      case "string":
      default:
        obj[field.key] = "";
    }
  });
  return obj;
};

const FieldEditor = ({ field, onChange, onDelete, darkMode }) => {
  const handleKeyChange = (e) => {
    onChange({ ...field, key: e.target.value });
  };

  const handleTypeChange = (value) => {
    const updated = { ...field, type: value };
    if (value !== "nested") updated.children = [];
    onChange(updated);
  };

  const addNestedField = () => {
    const updated = {
      ...field,
      children: [...(field.children || []), defaultField()],
    };
    onChange(updated);
  };

  const updateNestedField = (index, updatedChild) => {
    const newChildren = field.children.slice();
    newChildren[index] = updatedChild;
    onChange({ ...field, children: newChildren });
  };

  const deleteNestedField = (index) => {
    const newChildren = field.children.slice();
    newChildren.splice(index, 1);
    onChange({ ...field, children: newChildren });
  };

  return (
    <Card
      size="small"
      style={{
        marginBottom: 12,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        backgroundColor: darkMode ? "#1f1f1f" : "#ffffff",
        color: darkMode ? "#e6e6e6" : "#000000",
      }}
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
        <Input
          placeholder="Key"
          value={field.key}
          onChange={handleKeyChange}
          style={{ width: 180, borderRadius: 6 }}
        />
        <Select
          value={field.type}
          style={{ width: 160 }}
          onChange={handleTypeChange}
        >
          <Option value="string">String</Option>
          <Option value="number">Number</Option>
          <Option value="boolean">Boolean</Option>
          <Option value="array">Array</Option>
          <Option value="date">Date</Option>
          <Option value="email">Email</Option>
          <Option value="nested">Nested</Option>
        </Select>
        <Button danger type="primary" onClick={onDelete}>
          Delete
        </Button>
      </div>

      {field.type === "nested" && (
        <div style={{
          paddingLeft: 20,
          borderLeft: `3px solid ${darkMode ? '#5c5c5c' : '#d9d9d9'}`,
          marginTop: 10
        }}>
          {field.children.map((child, index) => (
            <FieldEditor
              key={index}
              field={child}
              darkMode={darkMode}
              onChange={(updatedChild) => updateNestedField(index, updatedChild)}
              onDelete={() => deleteNestedField(index)}
            />
          ))}
          <Button type="dashed" onClick={addNestedField} style={{ marginTop: 8 }}>
            + Add Nested Field
          </Button>
        </div>
      )}
    </Card>
  );
};

const JSONSchemaBuilder = () => {
  const [fields, setFields] = useState([defaultField()]);
  const [darkMode, setDarkMode] = useState(false);

  const addField = () => {
    setFields([...fields, defaultField()]);
  };

  const updateField = (index, updated) => {
    const newFields = [...fields];
    newFields[index] = updated;
    setFields(newFields);
  };

  const deleteField = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  return (
    <div style={{
      display: "flex",
      gap: 32,
      padding: 30,
      background: darkMode ? "#121212" : "#f7f8fa",
      minHeight: "100vh",
      color: darkMode ? "#e6e6e6" : "#000000",
      transition: "all 0.3s ease-in-out",
    }}>
      <div style={{
        position: "absolute",
        top: 20,
        right: 40,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: 8
      }}>
        <Text style={{ color: darkMode ? "#e6e6e6" : "#000" }}>Dark Mode</Text>
        <Switch checked={darkMode} onChange={setDarkMode} />
      </div>

      <div style={{
        flex: 1,
        background: darkMode ? "#1e1e1e" : "#ffffff",
        padding: 24,
        borderRadius: 16,
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)"
      }}>
        <Text strong style={{
          fontSize: 20,
          marginBottom: 20,
          display: "block",
          color: darkMode ? "#e6e6e6" : "#000"
        }}>🛠️ Schema Builder</Text>

        {fields.map((field, index) => (
          <FieldEditor
            key={index}
            field={field}
            darkMode={darkMode}
            onChange={(updatedField) => updateField(index, updatedField)}
            onDelete={() => deleteField(index)}
          />
        ))}
        <Button type="primary" onClick={addField} style={{ marginTop: 12 }}>
          + Add Field
        </Button>
      </div>

      <div style={{
        flex: 1,
        background: darkMode ? "#1e1e1e" : "#ffffff",
        padding: 24,
        borderRadius: 16,
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)"
      }}>
        <Text strong style={{
          fontSize: 20,
          marginBottom: 12,
          display: "block",
          color: darkMode ? "#e6e6e6" : "#000"
        }}>📦 JSON Output</Text>
        <pre style={{
          background: darkMode ? "#2a2a2a" : "#f0f0f0",
          padding: 16,
          minHeight: 300,
          borderRadius: 12,
          overflowX: "auto",
          color: darkMode ? "#d1ffd1" : "#000000"
        }}>
          {JSON.stringify(generateJson(fields), null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default JSONSchemaBuilder;
