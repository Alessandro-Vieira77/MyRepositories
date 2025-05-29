import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Owner,
  Loading,
  BackButton,
  IssuesList,
  PageActions,
  FilterList,
} from "../Repositorio/styles";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

export function Repositorio() {
  const { nameRepo } = useParams();

  const [repositorio, setRepositorio] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState([
    { state: "all", label: "Todas", active: true },
    { state: "open", label: "Abertas", active: false },
    { state: "closed", label: "Fechadas", active: false },
  ]);

  const [filterIndex, setFilterIndex] = useState(0);

  useEffect(() => {
    async function load() {
      // Making two calls at once
      const [repositorioData, issuesData] = await Promise.all([
        axios.get(`https://api.github.com/repos/${nameRepo}`),
        axios.get(`https://api.github.com/repos/${nameRepo}/issues`),
        {
          params: {
            state: filters.find((f) => f.active).state,
            per_page: 5,
          },
        },
      ]);
      setIssues(issuesData.data);
      setRepositorio(repositorioData.data);
      setLoading(false);
    }

    load();
  }, [nameRepo]);

  useEffect(() => {
    async function loadIssues() {
      const response = await axios.get(
        `https://api.github.com/repos/${nameRepo}/issues`,
        {
          params: {
            state: filters[filterIndex].state,
            page,
            per_page: 5,
          },
        }
      );
      setIssues(response.data);
    }

    loadIssues();
  }, [page, filterIndex, filters]);

  function handlePage(action) {
    setPage(action === "back" ? page - 1 : page + 1);
  }

  function handleFilter(index) {
    setFilterIndex(index);
  }

  if (loading) {
    return (
      <Loading>
        <h1>Carregando...</h1>
      </Loading>
    );
  }
  return (
    <>
      <Container>
        <BackButton>
          <Link to="/">
            <FaArrowLeft color="#000" size={30} />
          </Link>
        </BackButton>

        <Owner>
          <img
            src={repositorio.owner?.avatar_url}
            alt={repositorio.owner?.login}
          />
          <h1>{repositorio.name}</h1>
          <p>{repositorio.description}</p>
        </Owner>

        <FilterList active={filterIndex}>
          {filters.map((filter, index) => (
            <button
              type="button"
              key={filter.label}
              onClick={() => {
                handleFilter(index);
              }}
            >
              {filter.label}
            </button>
          ))}
        </FilterList>

        <IssuesList>
          {issues.map((issues) => (
            <li key={String(issues?.id)}>
              <img src={issues.user?.avatar_url} alt={issues.user?.login} />

              <div>
                <strong>
                  <a href={issues?.html_url}>{issues?.title}</a>

                  {issues.labels.map((label) => (
                    <span key={String(label?.id)}>{label?.name}</span>
                  ))}
                </strong>

                <p>{issues.user?.login}</p>
              </div>
            </li>
          ))}
        </IssuesList>

        <PageActions>
          <button
            type="button"
            onClick={() => {
              handlePage("back");
            }}
            disabled={page < 2}
          >
            Voltar
          </button>

          <button
            type="button"
            onClick={() => {
              handlePage("next");
            }}
          >
            Proxima
          </button>
        </PageActions>
      </Container>
    </>
  );
}
