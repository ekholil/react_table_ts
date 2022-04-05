import React, { useEffect, useState } from 'react';
import { DataModel } from './types';
import { styled } from '@mui/system';
import TablePaginationUnstyled from '@mui/base/TablePaginationUnstyled';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const Root = styled('div')`
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  td,
  th {
    border: 1px solid #ddd;
    text-align: left;
    padding: 8px;
  }

  th {
    background-color: #ddd;
  }
`;

const CustomTablePagination = styled(TablePaginationUnstyled)`
  & .MuiTablePaginationUnstyled-toolbar {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }

  & .MuiTablePaginationUnstyled-selectLabel {
    margin: 0;
  }

  & .MuiTablePaginationUnstyled-displayedRows {
    margin: 0;

    @media (min-width: 768px) {
      margin-left: auto;
    }
  }

  & .MuiTablePaginationUnstyled-spacer {
    display: none;
  }

  & .MuiTablePaginationUnstyled-actions {
    display: flex;
    gap: 0.25rem;
  }
`;
const DataTable = () => {
  const [tableData, setTableData] = useState<DataModel[]>([])
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const navigate = useNavigate()
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  let pageNum = 0;
 
  //first time data load
  useEffect(() => {
    fetch(`https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${pageNum}`)
    .then(res => res.json())
    .then(data => {
      setTableData(data.hits)
      console.log(data.hits)
    })
  }, [])


  useEffect(() => {
    setInterval(function () {
      incrementPageNo();
    }, 10000);

    const incrementPageNo = () => {
      pageNum += 1;
      fetch(
        `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${pageNum}`
      )
        .then((res) => res.json())
        .then((data) => {
          setTableData((prev) => [...prev, ...data.hits]);
          console.log(tableData);
        });
    };
  }, [pageNum]);
  
  return (
    <div>
      <h2>React Data Table</h2>

     <Container>
     <Root sx={{ maxWidth: '100%'}}>
      <table aria-label="custom pagination table">
        <thead>
          <tr>
            <th>Title</th>
            <th>URL</th>
            <th>Created At</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>
          {(rowsPerPage > 0
            ? tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : tableData
          ).map((row) => (
            <tr key={row.objectID} style={{cursor: 'pointer'}} onClick={() => navigate(`/item/${row.objectID}`)}>
              <td>{row.title}</td>
              <td style={{ width: 160 }} align="right">
                {row.url}
              </td>
              <td style={{ width: 160 }} align="right">
                {row.created_at}
              </td>
              <td>{row.author}</td>
            </tr>
          ))}
          {emptyRows > 0 && (
            <tr style={{ height: 41 * emptyRows }}>
              <td colSpan={3} />
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <CustomTablePagination
              rowsPerPageOptions={[10, 20, 30, { label: 'All', value: -1 }]}
              colSpan={3}
              count={tableData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              componentsProps={{
                select: {
                  'aria-label': 'rows per page',
                },
                actions: {
                  showFirstButton: true,
                  showLastButton: true,
                } as any,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </tr>
        </tfoot>
      </table>
    </Root>
     </Container>
    </div>
  );
};

export default DataTable;