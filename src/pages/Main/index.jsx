import { useState, useCallback, useEffect } from "react";
import { Container, Form, SubmitButton, List, DeleteButton } from "./styles";
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

export function Main() {
  const [newRepo, setNewRepo] = useState("");
  const [repositorios, setRespositorios] = useState([]);

  const [loaging, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Salvar alterações
  useEffect(() => {
    if (repositorios.length > 0) {
      localStorage.setItem("repositorio", JSON.stringify(repositorios));
    }
  }, [repositorios]);

  // Buscar;
  useEffect(() => {
    const reposi = localStorage.getItem("repositorio");
    if (reposi) {
      setRespositorios(JSON.parse(reposi));
    }
  }, []);

  function handleInputChange(e) {
    setNewRepo(e.target.value);
    setAlert(null);
  }

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      async function submit() {
        setLoading(true);
        axios
          .get(`https://api.github.com/repos/${newRepo}`)
          .then((response) => {
            const hasRepo = repositorios.find((r) => r.name === newRepo);
            if (hasRepo) {
              throw new Error("Repositorio duplicado");
            }
            const data = {
              name: response.data?.full_name,
            };

            setRespositorios([...repositorios, data]);
            setNewRepo("");
          })
          .catch((error) => {
            setAlert(true);
          })
          .finally(() => {
            setLoading(false);
            if (newRepo == "") {
              throw new Error("voce precisa digitar um repositorio");
            }
          });
      }
      submit();
    },
    [repositorios, newRepo]
  );

  const handleDelete = useCallback(
    (repo) => {
      const find = repositorios.filter((r) => {
        return r.name !== repo;
      });
      setRespositorios(find);
    },
    [repositorios]
  );

  return (
    <Container>
      <FaGithub size={25} />
      <h1>My Repositories</h1>

      <Form onSubmit={handleSubmit} error={alert}>
        <input
          type="text"
          placeholder="Adicionar Repositorios"
          value={newRepo}
          onChange={handleInputChange}
        />

        <SubmitButton loaging={loaging ? 1 : 0}>
          {loaging ? (
            <FaSpinner color="#FFF" size={14} />
          ) : (
            <FaPlus color="#FFF" size={14} />
          )}
        </SubmitButton>
      </Form>

      <List>
        {repositorios.map((repo) => (
          <li key={repo.name}>
            <span>
              <DeleteButton onClick={() => handleDelete(repo.name)}>
                <FaTrash size={14} />
              </DeleteButton>
              {repo.name}
            </span>
            <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
              <FaBars size={20} />
            </Link>
          </li>
        ))}
      </List>
    </Container>
  );
}
