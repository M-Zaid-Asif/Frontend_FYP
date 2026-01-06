const Footer = () => {

  return (
    <footer className="bg-gray-900 text-white p-12 mt-auto">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-black text-xl mb-4">FAEAS</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Verified emergency response information for the citizens of Pakistan. 
              Always prioritize professional help.
            </p>
          </div>
          <div className="text-left md:text-right flex flex-col justify-end">
            <p className="text-xs text-gray-500">© 2026 FAEAS Relief Systems.</p>
            <p className="text-[10px] text-red-500 mt-2 font-bold uppercase">In case of extreme emergency, Dial 1122 or 15.</p>
          </div>
        </div>
      </footer>

  );
};

export default Footer;
