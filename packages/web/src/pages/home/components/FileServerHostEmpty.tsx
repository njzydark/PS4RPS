import { Button, Empty } from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';

export const FileServerHostEmpty = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Empty
        description={
          <>
            <div>Please add file server host first</div>
            <Button
              icon={<IconPlus />}
              type="primary"
              style={{ marginTop: 8 }}
              onClick={() => {
                navigate('/hosts?openFileServerHost=true');
              }}
            />
          </>
        }
      />
    </div>
  );
};
